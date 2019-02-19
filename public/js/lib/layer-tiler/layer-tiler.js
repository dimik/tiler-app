modules.define('layer-tiler', [
    'inherit',
    'vow',
    'layer-tiler-tile-source',
    'node-util',
    'node-path',
    'node-fs',
    'vow-queue',
    'vow-node',
    'layer-tiler-page-template',
    'layer-tiler-config'
], function (provide, inherit, vow, TileSource, util, path, fs, Queue, vowNode, PageTemplate, config) {

    /**
     * User-Map-Layer Tiler Class.
     * Split source image by tiles.
     * @class
     * @name LayerTiler
     */
    var LayerTiler = inherit(/** @lends LayerTiler prototype. */ {
        /**
         * @constructor
         */
        __constructor: function () {
            this._source = new TileSource();
        },
        /**
         * Open source image.
         * @function
         * @name LayerTiler.openSource
         * @param {String} url Path to the source image.
         * @returns {vow.Promise} Promise A+.
         */
        openSource: function (url) {
            return this._source
                .open(url);
        },
        /**
         * Render tiles from source image.
         * @function
         * @name LayerTiler.render
         * @returns {vow.Promise} Promise A+.
         */
        render: function () {
            var queue = this._queue = new Queue({ weightLimit : 10 }),
                source = this._source,
                minZoom = source.getMinZoom(),
                maxZoom = source.getMaxZoom(),
                output = config.get('output'),
                folders = [], tasks = [],
                enqueue = function (task) {
                    tasks.push(queue.enqueue(task, { priority: 1, weight: 1 }));
                },
                getProgress = function (num) {
                    return Math.round(num * 100 / tasks.length);
                };

            for(var zoom = maxZoom; zoom >= minZoom; zoom--) {
                var tilesCount = source.getTilesNumberAtZoom(zoom);

                folders.push(path.join(output, zoom.toString(10)));

                for(var x = 0; x < tilesCount; x++) {
                    for(var y = 0; y < tilesCount; y++) {
                        if(source.isTileFound(x, y, zoom)) {
                            enqueue(this.saveTile.bind(this, x, y, zoom));
                        }
                    }
                }
            }

            return this._createFolders(folders)
                .then(function () {
                    queue.start();

                    return vow.all(tasks);
                })
                .then(this._saveIndexPage.bind(this))
                .progress(function (message) {
                    var stats = queue.getStats();

                    return {
                        message: message,
                        processed: getProgress(stats.processedTasksCount),
                        processing: getProgress(stats.processingTasksCount)
                    };
                });
        },
        cancel: function () {
            this._queue.stop();
        },
        getTileSource: function () {
            return this._source;
        },
        _execute: function (resource, handler, validate) {
            var retries = config.get('retryCount'),
                promise = handler();

            while(retries--) {
                promise = promise
                    .fail(function (err) {
                        return this._getStats(resource)
                            .then(validate);
                    }, this)
                    .fail(handler);
            }

            return promise;
        },
        /**
         * Render one tile.
         * @function
         * @name LayerTiler.saveTile
         * @param {Number} x Tile coordinate by X.
         * @param {Number} y Tile coordinate by Y.
         * @param {Number} zoom
         * @returns {vow.Promise} Promise A+.
         */
        saveTile: function (x, y, zoom) {
            var tile = this._source.renderTile(x, y, zoom),
                url = util.format(config.get('urlTemplate'), config.get('output'), zoom, x, y, tile.getFileType());

            return tile.toFile()
                .then(function (data) {
                    return this._uploadFile(url, data);
                }, this);
        },
        _uploadFile: function (url, data) {
            var defer = vow.defer();

            window.setTimeout(function () {
                defer.notify(util.format('uploading file: %s', url));
            });

            this._execute(url, function () {
                return vowNode.invoke(fs.writeFile, url, data);
            }, function (stats) {
                if(stats.isFile()) {
                    return stats;
                }

                throw new TypeError('resource is not a file');
            })
            .done(
                defer.resolve,
                // defer.reject,
                function (err) {
                    console.log('upload failed %s', url, err.statusText || err);

                    return err;
                },
                defer
            );

            return defer.promise();
        },
        /**
         * Folders creation helper.
         * @function
         * @private
         * @name LayerTiler._createFolder
         * @param {String} name Folder path and name.
         * @returns {vow.Promise} Promise A+.
         */
        _createFolder: function (name) {
            var url = path.resolve(name);

            return this._execute(url, function () {
                return vowNode.invoke(fs.mkdir, url);
            }, function (res) {
                if(res.isDirectory()) {
                    return res;
                }

                throw new TypeError('resource is not a directory');
            });
        },
        _createFolders: function (folders) {
            var output = config.get('output');

            return this._createFolder(output)
                .then(function () {
                    return vow.all(
                        folders.map(this._createFolder, this)
                    );
                }, this);
        },
        _getStats: function (path) {
            return vowNode.invoke(fs.stat, path)
                .then(function (res) {
                    console.log('%s exists', path);

                    return res;
                }, function (err) {
                    console.log('%s does not exist', path);

                    return err;
                });
        },
        publish: function () {
            var url = config.get('output');

            return this._execute(url, function () {
                return vowNode.invoke(fs.chmod, url, 'a+r');
            }, function (res) {
                if(res.public_url) {
                    return res;
                }

                throw new TypeError('resource is not public');
            })
            .then(function (res) {
                return JSON.parse(res.toJSON());
            });
        },
        _saveIndexPage: function () {
            var source = this._source,
                url = path.join(config.get('output'), 'index.html'),
                template = new PageTemplate(),
                page = template.render({
                    layerMinZoom: source.getMinZoom(),
                    layerMaxZoom: source.getMaxZoom(),
                    tileType: source.options.get('type').replace('image/', '')
                });

            return this._uploadFile(url, page);
        }
    });

    provide(LayerTiler);
});

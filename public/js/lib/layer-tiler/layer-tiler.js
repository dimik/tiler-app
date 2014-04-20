modules.define('layer-tiler', [
    'inherit',
    'vow',
    'layer-tiler-tile-source',
    'node-util',
    'node-path',
    'node-fs',
    'vow-queue',
    'layer-tiler-config'
], function (provide, inherit, vow, TileSource, util, path, fs, Queue, config) {

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
                tasks = [],
                enqueue = function (task, priority, weight) {
                    tasks.push(queue.enqueue(task, { priority: priority, weight: weight }));
                },
                getProgress = function (num) {
                    return Math.round(num * 100 / tasks.length);
                };

            enqueue(this._createFolder.bind(this, output), 3, 10);

            for(var zoom = maxZoom; zoom >= minZoom; zoom--) {
                var tilesCount = source.getTilesNumberAtZoom(zoom),
                    folderName = path.join(output, zoom.toString(10));

                enqueue(this._createFolder.bind(this, folderName), 2, 10);

                for(var x = 0; x < tilesCount; x++) {
                    for(var y = 0; y < tilesCount; y++) {
                        if(source.isTileFound(x, y, zoom)) {
                            enqueue(this.renderTile.bind(this, x, y, zoom), 1, 1);
                        }
                    }
                }
            }

            queue.start();

            return vow.all(tasks)
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
        /**
         * Render one tile.
         * @function
         * @name LayerTiler.renderTile
         * @param {Number} x Tile coordinate by X.
         * @param {Number} y Tile coordinate by Y.
         * @param {Number} zoom
         * @returns {vow.Promise} Promise A+.
         */
        renderTile: function (x, y, zoom) {
            var source = this._source,
                defer = vow.defer();

            source.getTile(x, y, zoom)
                .save(path.join(config.get('output'), zoom.toString(10)), x, y, zoom)
                .done(function (res) {
                    defer.notify(util.format('rendering tile: zoom=%s, x=%s, y=%s', zoom, x, y));
                    defer.resolve(res);
                });

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
            var defer = vow.defer();

            fs.mkdir(path.resolve(name), function (err) {
                defer.notify(util.format('creating folder: name=%s', name));
                if(err) {
                    defer.reject(err);
                }
                else {
                    defer.resolve();
                }
            });

            return defer.promise();
        }
    });

    provide(LayerTiler);
});

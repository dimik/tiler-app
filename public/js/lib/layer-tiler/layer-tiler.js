modules.define('layer-tiler', [
    'inherit',
    'vow',
    'layer-tiler-tile-source',
    'node-util',
    'node-path',
    'node-fs'
], function (provide, inherit, vow, TileSource, util, path, fs) {

    /**
     * User-Map-Layer Tiler Class.
     * Split source image by tiles.
     * @class
     * @name LayerTiler
     */
    var LayerTiler = inherit(/** @lends LayerTiler prototype. */ {
        /**
         * @constructor
         * @param {Object} options LayerTiler options.
         */
        __constructor: function (options) {
            this._options = extend({}, this.getDefaults(), options);
            this._source = new TileSource(this._options);
            this._state = null;
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
            var defer = vow.defer(),
                options = this._options,
                source = this._source,
                sourceOptions = source.getOptions(),
                minZoom = ~~sourceOptions.minZoom,
                maxZoom = isFinite(sourceOptions.maxZoom)? ~~sourceOptions.maxZoom : source.getZoomBySource(),
                handlers = [
                    this._createFolder.bind(this, options.output)
                ];

            this._state = 'processing';

            for(var zoom = maxZoom; zoom >= minZoom; zoom--) {
                var tilesCount = source.getTilesNumberAtZoom(zoom),
                    folderName = path.join(options.output, zoom.toString(10));

                handlers.push(
                    this._createFolder.bind(this, folderName)
                );

                for(var x = 0; x < tilesCount; x++) {
                    for(var y = 0; y < tilesCount; y++) {
                        if(source.isTileFound(x, y, zoom)) {
                            handlers.push(
                                this.renderTile.bind(this, x, y, zoom)
                            );
                        }
                    }
                }
            }

            var num = handlers.length;

            this._resolveAllHandlers(handlers)
                .progress(function (message) {
                    defer.notify({ message: message, progress: 100 - Math.floor(--num * 100 / handlers.length) });
                })
                .done(defer.resolve, defer.reject, defer);

            return defer.promise();
        },
        cancel: function () {
            this._state = 'cancelled';
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
                .save(this.getTileUrl(x, y, zoom), source.getOptions().tileType)
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
        },
        /**
         * Process handlers in sequence.
         * @function
         * @private
         * @name LayerTiler._resolveAllHandlers
         * @param {Array} handlers List of the handlers.
         * @returns {vow.Promise} Promise A+
         */
        _resolveAllHandlers: function (handlers) {
            var defer = vow.defer();

            vow.all(
                handlers.reduce(function (promises, handler, index) {
                    promises.push(promises[index].then(function () {
                        if(this._state === 'cancelled') {
                            throw 'Операция отменена пользователем';
                        }
                        return handler().progress(defer.notify, defer);
                    }, this));

                    return promises;
                }.bind(this), [ vow.resolve() ])
            )
            .done(function (results) {
                defer.resolve(results.slice(1));
            }, defer.reject, defer);

            return defer.promise();
        },
        /**
         * @function
         * @name LayerTiler.getTileUrl
         * @param {Number} x Tile coordinate by X.
         * @param {Number} y Tile coordinate by Y.
         * @param {Number} zoom
         * @return {String} Tile path and name.
         */
        getTileUrl: function (x, y, zoom) {
            var options = this._options,
                tileType = this._source.getOptions().tileType;

            return util.format(options.tileUrlTemplate, options.output, zoom, x, y, tileType.replace('image/', ''));
        },
        getOptions: function () {
            return extend({}, this._options, this._source.getOptions());
        },
        setOptions: function (options) {
            extend(this._options, {
                output: options.output
            });
            this._source.setOptions(options);

            return this;
        },
        /**
         * Default options.
         * @function
         * @name LayerTiler.getDefaults
         * @returns {Object} Options.
         */
        getDefaults: function () {
            return {
                output: 'tiles-' + Date.now(),
                tileUrlTemplate: '%s/%s/%s-%s.%s'
            };
        }
    });

    /**
     * Extends target object with properties of one or more source objects.
     * @function
     * @private
     * @name extend
     * @param {Object} target
     * @param {Object} source
     * @returns {Object} Aggregates all own enumerable properties of the source objects.
     */
    function extend (target, source) {
        var slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        slice.call(arguments, 1).forEach(function (o) {
            for(var key in o) {
                hasOwnProperty.call(o, key) && (target[key] = o[key]);
            }
        });

        return target;
    }

    provide(LayerTiler);
});

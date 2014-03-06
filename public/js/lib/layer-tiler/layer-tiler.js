define(function(require, exports, module) {

var Vow = require('vow'),
    inherit = require('inherit'),
    util = require('util'),
    events = require('events'),
    fs = require('fs'),
    path = require('path'),
    Tile = require('./tile'),
    TileSource = require('./tile-source');

/**
 * User-Map-Layer Tiler Class.
 * Split source image by tiles.
 * @class
 * @name LayerTiler
 */
var LayerTiler = module.exports = inherit(/** @lends LayerTiler prototype. */ {
    /**
     * @constructor
     * @param {Object} options LayerTiler options.
     */
    __constructor: function (options) {
        this._source = new TileSource();
        this._options = this._extend({}, this.getDefaults(), options);
        this.events = new events.EventEmitter();
        this._state = null;
    },
    /**
     * Open source image.
     * @function
     * @name LayerTiler.openSource
     * @param {String} url Path to the source image.
     * @returns {Vow} Promise A+.
     */
    openSource: function (url) {
        return this._source
            .open(url);
    },
    /**
     * Render tiles from source image.
     * @function
     * @name LayerTiler.render
     * @returns {Vow} Promise A+.
     */
    render: function () {
        var defer = new Vow.Deferred(),
            options = this._options,
            minZoom = ~~options.minZoom,
            handlers = [
                this._createFolder.bind(this, options.output)
            ],
            maxZoom = isFinite(options.maxZoom)? ~~options.maxZoom : this.getZoomBySource(),
            requests = handlers.length;

        this._state = 'processing';

        for(var zoom = maxZoom; zoom >= minZoom; zoom--) {
            handlers.push(
                this._createFolder.bind(this, path.join(options.output, zoom.toString(10))),
                this.renderTilesAtZoom.bind(this, zoom)
            );
            requests += this._getTilesAmountAtZoom(zoom) + 1;
        }

        var num = requests;

        this._resolveAllHandlers(handlers)
            .progress(function (message) {
                defer.notify({ message: message, progress: 100 - Math.floor(--num * 100 / requests) });
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
     * @returns {Vow} Promise A+.
     */
    renderTile: function (x, y, zoom) {
        var defer = new Vow.Deferred();

        this.createTile(x, y, zoom)
            .save(
                this.getTileUrl(x, y, zoom),
                this._options.tileType
            )
            .done(function (res) {
                defer.notify(util.format('rendering tile: zoom=%s, x=%s, y=%s', zoom, x, y));
                defer.resolve(res);
            });

        return defer.promise();
    },
    createTile: function (x, y, zoom) {
        var tileSize = this._options.tileSize,
            globalPixelPoint = [ x * tileSize, y * tileSize ],
            topLeft = this.fromGlobalPixels(
                globalPixelPoint,
                zoom
            ),
            bottomRight = this.fromGlobalPixels(
                [ globalPixelPoint[0] + tileSize, globalPixelPoint[1] + tileSize ],
                zoom
            ),
            offset = [ bottomRight[0] - topLeft[0], bottomRight[1] - topLeft[1] ],
            tileOffset = [
                topLeft[0] === 0? tileSize - offset[0] : 0,
                topLeft[1] === 0? tileSize - offset[1] : 0
            ];

        if(zoom === 0) {
            tileOffset = [
                Math.round((tileSize - offset[0]) / 2),
                Math.round((tileSize - offset[1]) / 2)
            ];
        }

        return this._source
            .cropTo(
                new Tile(tileSize, tileSize),
                topLeft[0],
                topLeft[1],
                offset[0],
                offset[1],
                tileOffset[0],
                tileOffset[1],
                offset[0],
                offset[1]
            );
    },
    /**
     * @function
     * @name LayerTiler.resizeSourceAtZoom
     * @param {Number} zoom
     */
    resizeSourceAtZoom: function (zoom) {
        var source = this._source,
            tileSize = this._options.tileSize,
            tilesSize = this.getTilesNumberAtZoom(zoom) * tileSize,
            curZoom = this.getZoomBySource(),
            curTilesSize = this.getTilesNumberAtZoom(curZoom) * tileSize,
            coef = Math.pow(2, curZoom - zoom),
            width = source.getWidth(), height = source.getHeight(),
            curLongestSideSize = Math.max(width, height),
            curOffset = curTilesSize - curLongestSideSize,
            offset = Math.round(curOffset / coef),
            longestSideSize = tilesSize - offset,
            proportion = curLongestSideSize / Math.min(width, height);

        if(source.getWidth() > source.getHeight()) {
            this._source
                .resize(longestSideSize, Math.round(longestSideSize / proportion));
        }
        else {
            this._source
                .resize(Math.round(longestSideSize / proportion), longestSideSize);
        }
    },
    /**
     * Calculate zoom value by source size.
     * @function
     * @name LayerTiler.getZoomBySource
     * @returns {Number} Zoom value.
     */
    getZoomBySource: function () {
        var source = this._source,
            tileSize = this._options.tileSize,
            log2 = function (n) {
                return Math.log(n) / Math.log(2);
            },
            tilesCount = Math.ceil(
                Math.max(
                    Math.ceil(source.getWidth() / tileSize),
                    Math.ceil(source.getHeight() / tileSize)
                )
            );

        return Math.ceil(log2(tilesCount));
    },
    /**
     * Calculate number of tiles at the current zoom.
     * @name LayerTiler.getTilesNumberAtZoom
     * @param {Number} zoom
     * @returns {Number} Tiles count at zoom.
     */
    getTilesNumberAtZoom: function (zoom) {
        return Math.pow(2, zoom);
    },
    /**
     * @function
     * @name LayerTiler.renderTilesAtZoom
     * @param {Number} zoom
     * @returns {Vow} Promise A+.
     */
    renderTilesAtZoom: function (zoom) {
        var source = this._source,
            tilesCount = this.getTilesNumberAtZoom(zoom),
            handlers = [];

        if(zoom < ~~this._options.maxZoom) {
            this.resizeSourceAtZoom(zoom);
        }

        for(var x = 0; x < tilesCount; x++) {
            for(var y = 0; y < tilesCount; y++) {
                if(this.isTileFound(source.getWidth(), source.getHeight(), x, y, zoom)) {
                    handlers.push(
                        this.renderTile.bind(this, x, y, zoom)
                    );
                }
            }
        }

        return this._resolveAllHandlers(handlers);
    },
    _getTilesAmountAtZoom: function (zoom) {
        var source = this._source,
            tilesCount = this.getTilesNumberAtZoom(zoom),
            maxZoom = this._options.maxZoom,
            width = maxZoom > zoom? source.getWidth() / 2 * (maxZoom - zoom) : source.getWidth(),
            height = maxZoom > zoom? source.getHeight() / 2 * (maxZoom - zoom) : source.getHeight(),
            amount = 0;

        for(var x = 0; x < tilesCount; x++) {
            for(var y = 0; y < tilesCount; y++) {
                if(this.isTileFound(width, height, x, y, zoom)) {
                    amount++;
                }
            }
        }

        return amount;
    },
    /**
     * Folders creation helper.
     * @function
     * @private
     * @name LayerTiler._createFolder
     * @param {String} name Folder path and name.
     * @returns {Vow} Promise A+.
     */
    _createFolder: function (name) {
        var defer = new Vow.Deferred();

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
     * Check if we need to render this tile.
     * @function
     * @name LayerTiler.isTileFound
     * @param {Number} width Source width.
     * @param {Number} height Source heigth.
     * @param {Number} x Tile coordinate by X.
     * @param {Number} y Tile coordinate by Y.
     * @param {Number} zoom
     * @returns {Boolean}
     */
    isTileFound: function (width, height, x, y, zoom) {
        var tileSize = this._options.tileSize,
            tilesCount = this.getTilesNumberAtZoom(zoom),
            tilesCountByWidth = Math.ceil(width / tileSize / 2) * 2,
            tilesCountByHeight = Math.ceil(height / tileSize / 2) * 2,
            offset = [
                (tilesCount - tilesCountByWidth) / 2,
                (tilesCount - tilesCountByHeight) / 2
            ];

        return (x >= offset[0] && x < tilesCountByWidth + offset[0]) &&
            (y >= offset[1] && y < tilesCountByHeight + offset[1]);
    },
    /**
     * Get source point coordinates by global tile coordinates at current zoom.
     * @function
     * @name LayerTiler.fromGlobalPixels
     * @param {Number[]} globalPixelPoint Global pixel coordinates.
     * @param {Number} zoom
     * @returns {Number[]} Coordinates local to source image.
     */
    fromGlobalPixels: function (globalPixelPoint, zoom) {
        var source = this._source,
            tileSize = this._options.tileSize,
            tilesCount = this.getTilesNumberAtZoom(zoom),
            pixelsCount = tilesCount * tileSize,
            offset = [
                Math.ceil((pixelsCount - source.getWidth()) / 2),
                Math.ceil((pixelsCount - source.getHeight()) / 2)
            ];

        return [
            Math.min(
                Math.max(globalPixelPoint[0] - offset[0], 0),
                source.getWidth()
            ),
            Math.min(
                Math.max(globalPixelPoint[1] - offset[1], 0),
                source.getHeight()
            )
        ];
    },
    /**
     * Process handlers in sequence.
     * @function
     * @private
     * @name LayerTiler._resolveAllHandlers
     * @param {Array} handlers List of the handlers.
     * @returns {Vow} Promise A+
     */
    _resolveAllHandlers: function (handlers) {
        var defer = new Vow.Deferred();

        Vow.all(
            handlers.reduce(function (promises, handler, index) {
                promises.push(promises[index].then(function () {
                    if(this._state === 'cancelled') {
                        throw 'Операция отменена пользователем';
                    }
                    return handler().progress(defer.notify, defer);
                }, this))

                return promises;
            }.bind(this), [ Vow.resolve() ])
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
        var options = this._options;

        return util.format(options.tileUrlTemplate, options.output, zoom, x, y, options.tileType.replace('image/', ''));
    },
    getOptons: function () {
        return this._options;
    },
    setOptions: function (options) {
        this._extend(this._options, options);

        return this;
    },
    /**
     * Extends target object with properties of one or more source objects.
     * @function
     * @private
     * @name LayerTiler._extend
     * @param {Object} target
     * @param {Object} source
     * @returns {Object} Aggregates all own enumerable properties of the source objects.
     */
    _extend: function (target, source) {
        var slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        slice.call(arguments, 1).forEach(function (o) {
            for(var key in o) {
                hasOwnProperty.call(o, key) && (target[key] = o[key]);
            }
        });

        return target;
    },
    /**
     * Default options.
     * @function
     * @name LayerTiler.getDefaults
     * @returns {Object} Options.
     */
    getDefaults: function () {
        return {
            output: 'tiles',
            tileUrlTemplate: '%s/%s/%s-%s.%s',
            tileSize: 256,
            tileType: 'image/png',
            minZoom: 0
        };
    }
});

});

modules.define('layer-tiler-tile-source', [
    'inherit',
    'layer-tiler-image-source',
    'layer-tiler-tile',
    'node-canvas',
    'tile-config',
], function (provide, inherit, ImageSource, Tile, Canvas, config) {

    /**
     * @class
     * @name TileSource
     * @augments ImageSource
     */
    var TileSource = inherit(ImageSource, /** @lends TileSource prototype */ {
        /**
         * @constructor
         */
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._minZoom = 0;
            this._maxZoom = 0;
            this.options = config;
        },
        open: function () {
            var promise = this.__base.apply(this, arguments);

            return promise.then(function (res) {
                this.setMaxZoom(this.getZoomBySource());

                return res;
            }, this);
        },
        cropTo: function (tile, sx, sy, sw, sh, tx, ty, tw, th) {
            return tile
                .setOpacity(config.get('opacity'))
                .setFillStyle(config.get('color'))
                .draw(this._source.getElement(), sx, sy, sw, sh, tx, ty, tw, th);
        },
        getZoomBySource: function () {
            var tileSize = config.get('size'),
                log2 = function (n) {
                    return Math.log(n) / Math.log(2);
                },
                tilesCount = Math.ceil(
                    Math.max(
                        Math.ceil(this.getWidth() / tileSize),
                        Math.ceil(this.getHeight() / tileSize)
                    )
                );

            return Math.ceil(log2(tilesCount));
        },
        getTile: function (x, y, zoom) {
            if(!this.isTileFound(x, y, zoom)) {
                return null;
            }

            var tileSize = config.get('size'),
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
                localPoint = this.toLocalPixels(topLeft, zoom),
                localOffset = this.toLocalPixels(offset, zoom),
                tileOffset = [
                    topLeft[0] === 0? tileSize - offset[0] : 0,
                    topLeft[1] === 0? tileSize - offset[1] : 0
                ];

            return this.cropTo(
                new Tile(tileSize),
                localPoint[0],
                localPoint[1],
                localOffset[0],
                localOffset[1],
                zoom === 0? tileOffset[0] / 2 : tileOffset[0],
                zoom === 0? tileOffset[1] / 2 : tileOffset[1],
                offset[0],
                offset[1]
            );
        },
        toLocalPixels: function (point, zoom) {
            var sZoom = this.getZoomBySource(),
                getSizeAtZoom = function (size) {
                    return size * Math.pow(2, sZoom - zoom);
                };

            return [
                getSizeAtZoom(point[0]),
                getSizeAtZoom(point[1])
            ];
        },
        getSourceSizeAtZoom: function (zoom) {
            var sZoom = this.getZoomBySource(),
                getSizeAtZoom = function (size) {
                    return size / Math.pow(2, sZoom - zoom);
                };

            return [
                getSizeAtZoom(this.getWidth()),
                getSizeAtZoom(this.getHeight())
            ];
        },
        fromGlobalPixels: function (globalPixelPoint, zoom) {
            var size = this.getSourceSizeAtZoom(zoom),
                width = size[0], height = size[1],
                tileSize = config.get('size'),
                tilesCount = this.getTilesNumberAtZoom(zoom),
                pixelsCount = tilesCount * tileSize,
                offset = [
                    Math.ceil((pixelsCount - width) / 2),
                    Math.ceil((pixelsCount - height) / 2)
                ];

            return [
                Math.min(
                    Math.max(globalPixelPoint[0] - offset[0], 0),
                    width
                ),
                Math.min(
                    Math.max(globalPixelPoint[1] - offset[1], 0),
                    height
                )
            ];
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
        isTileFound: function (x, y, zoom) {
            var tileSize = config.get('size'),
                tilesCount = this.getTilesNumberAtZoom(zoom),
                size = this.getSourceSizeAtZoom(zoom),
                width = size[0], height = size[1],
                tilesCountByWidth = Math.ceil(width / tileSize / 2) * 2,
                tilesCountByHeight = Math.ceil(height / tileSize / 2) * 2,
                offset = [
                    (tilesCount - tilesCountByWidth) / 2,
                    (tilesCount - tilesCountByHeight) / 2
                ];

            return (x >= offset[0] && x < tilesCountByWidth + offset[0]) &&
                (y >= offset[1] && y < tilesCountByHeight + offset[1]);
        },
        getMinZoom: function () {
            return this._minZoom;
        },
        setMinZoom: function (minZoom) {
            this._minZoom = ~~minZoom;

            return this;
        },
        getMaxZoom: function () {
            return this._maxZoom;
        },
        setMaxZoom: function (maxZoom) {
            this._maxZoom = ~~maxZoom;

            return this;
        }
    });

    provide(TileSource);
});

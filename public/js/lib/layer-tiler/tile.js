modules.define('layer-tiler-tile', [
    'inherit',
    'vow',
    'layer-tiler-image-source',
    'node-canvas',
    'tile-config'
], function (provide, inherit, vow, ImageSource, Canvas, config) {

    /**
     * @class
     * @name Tile
     * @augments ImageSource
     * @param {Number} width Tile width.
     * @param {Number} height Tile height.
     */
    var Tile = inherit(ImageSource, /** @lends Tile prototype. */ {
        /**
         * @constructor
         */
        __constructor: function (size) {
            this._source = new Canvas(size, size);
        },
        resize: function (size) {
            var canvas = new Canvas(size, size),
                ctx = canvas.getContext('2d');

            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(this._source.getElement(), 0, 0, size, size);

            this._source = canvas;

            return this;
        },
        draw: function (source, sx, sy, sw, sh, tx, ty, tw, th) {
            this.getContext()
                .drawImage(source, sx, sy, sw, sh, tx, ty, tw, th);

            return this;
        },
        getFillStyle: function () {
            return this.getSource().getContext().fillStyle;
        },
        /**
         * @see http://www.w3schools.com/cssref/css_colors_legal.asp
         */
        setFillStyle: function (fillStyle) {
            var ctx = this.getSource().getContext(),
                tmp = ctx.globalCompositeOperation;

            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = fillStyle;
            ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
            ctx.globalCompositeOperation = tmp;

            return this;
        },
        getOpacity: function () {
            return this._source.getContext().globalAlpha;
        },
        setOpacity: function (opacity) {
            this._source.getContext().globalAlpha = opacity;

            return this;
        },
        getFileType: function () {
            return config.get('type').replace('image/', '');
        },
        toFile: function (type) {
            var defer = vow.defer();
            this._source.toBlob(function (blob) {
                defer.resolve(blob);
            }, type || config.get('type'));
            return defer.promise();
        },
        toDataURL: function (type) {
            return this._source.toDataURL(type || config.get('type'));
        }
    });

    provide(Tile);
});

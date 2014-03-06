define(function (require, exports, module) {

var Canvas = require('canvas'),
    fs = require('fs'),
    inherit = require('inherit'),
    Vow = require('vow'),
    ImageSource = require('./image-source');

/**
 * @class
 * @name Tile
 * @augments ImageSource
 * @param {Number} width Tile width.
 * @param {Number} height Tile height.
 */
var Tile = module.exports = inherit(ImageSource, /** @lends Tile prototype. */ {
    /**
     * @constructor
     */
    __constructor: function (size) {
        this._source = new Canvas(size, size);
    },
    /**
     * Write canvas source to the image file.
     * @borrows ImageSource.save
     * @function
     * @name Tile.save
     * @param {String} url Path to the image.
     * @param {String} [type="png"] Type of the image "png" or "jpg".
     * @returns {Vow} Promise A+.
     */
    save: function (url, type) {
        //if(type == null || type == 'png') {
            return this.__base.apply(this, arguments);
        //}

        /**
         * If type is "jpg".
        var defer = new Vow.Deferrer(),
            out = fs.createWriteStream(url),
            stream = this._source.createJPGStream(
                this.getDefaults()
            );

        out.once('finish', defer.resolve);

        stream.pipe(out);

        return defer.promise();
         */
    },
    resize: function (size) {
        var canvas = new Canvas(size, size),
            ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this._source.getElement(), 0, 0, size, size);

        this._source = canvas;
    },
    toDataURL: function (type) {
        return this.getSource().getElement().toDataURL(type);
    },
    /**
     * Default options.
     * @function
     * @name Tile.getDefaults
     * @returns {Object} Options.
     */
    getDefaults: function () {
        return {
            bufsize: 2048,
            quality: 80,
            progressive: false
        };
    }
});

});

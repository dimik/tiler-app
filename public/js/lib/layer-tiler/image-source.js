modules.define('layer-tiler-image-source', [
    'inherit',
    'vow',
    'node-canvas'
], function (provide, inherit, vow, Canvas) {

    /**
     * Base Class for Tile and TileSource.
     * @class
     * @function
     * @name ImageSource
     */
    var ImageSource = inherit(/** @lends ImageSource prototype. */ {
        /**
         * @constructor
         */
        __constructor: function () {
            this._source = new Canvas.Image();
        },
        /**
         * Getter for Canvas source.
         * @function
         * @name ImageSource.getSource
         * @returns {Canvas} Source of the Image.
         */
        getSource: function () {
            return this._source;
        },
        /**
         * Getter for Canvas context.
         * @function
         * @name ImageSource.getContext
         * @returns {Object} Canvas context object.
         */
        getContext: function () {
            return this._source.getContext('2d');
        },
        /**
         * Getter for Canvas width.
         * @function
         * @name ImageSource.getWidth
         * @returns {Number} Canvas width.
         */
        getWidth: function () {
            return this._source.width;
        },
        /**
         * Getter for Canvas height.
         * @function
         * @name ImageSource.getHeight
         * @returns {Number} Canvas height.
         */
        getHeight: function () {
            return this._source.height;
        },
        /**
         * Open the image file.
         * @function
         * @name ImageSource.open
         * @param {String} url Path to the image file.
         * @returns {vow.Promise} Promise A+
         */
        open: function (url) {
            var source = this._source,
                defer = vow.defer(),
                cleanUp = function () {
                    source.onload = source.onerror = null;
                };

            source.onload = function () {
                defer.resolve(source);
                // cleanUp();
            };

            source.onerror = function (err) {
                defer.reject(err);
                // cleanUp();
            };

            source.src = url;

            return defer.promise();
        }
    });

    provide(ImageSource);
});

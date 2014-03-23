modules.define('node-canvas', [
    'inherit'
], function (provide, inherit) {

    var Canvas = inherit(/** @lends Canvas.prototype */{
        __constructor: function (width, height) {
            this._canvas = document.createElement('canvas');

            this._canvas.width = this.width = width;
            this._canvas.height = this.height = height;
        },
        getContext: function () {
            return this._canvas.getContext('2d');
        },
        getElement: function () {
            return this._canvas;
        },
        createJPGStream: function (options) {
        },
        createPNGStream: function (options) {
        },
        toBuffer: function (type, callback) {
            var dataURL = this.toDataURL(type),
                data = dataURL.split(';base64,');

            callback(null, this.__self.binarytoBlob(
                atob(data[1]),
                data[0].split(':')[1]
            ));
        },
        toDataURL: function (type) {
            return this._canvas.toDataURL(type);
        }
    }, {
        binarytoBlob: function (data, type) {
            var bytes = data.length,
                view = new Uint8Array(new ArrayBuffer(bytes));

            for(var i = 0; i < bytes; i++) {
                view[i] = data.charCodeAt(i);
            }

            return new Blob([ view.buffer ], { type: type || 'application/octet-stream' });
        }
    });

    Canvas.Image = inherit(Canvas, /** @lends Canvas.Image prototype */{
        __constructor: function () {
            var self = this,
                base = this.__base,
                img = new Image(),
                cleanUp = function () {
                    img.onload = img.onerror = null;
                };

            Object.defineProperties(self, {
                onload: {
                    set: function (callback) {
                        img.onload = function () {
                            base.call(self, img.width, img.height);
                            self.getContext().drawImage(img, 0, 0);
                            callback.apply(img, arguments);
                            cleanUp();
                        };
                    }
                },
                onerror: {
                    set: function (callback) {
                        img.onerror = function () {
                            callback.apply(img, arguments);
                            cleanUp();
                        };
                    }
                },
                src: {
                    set: function (src) {
                        img.src = src;
                    },
                    get: function () {
                        return img.src;
                    }
                }
            });
        }
    });

    provide(Canvas);
});

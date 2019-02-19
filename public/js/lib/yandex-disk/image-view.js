modules.define('yandex-disk-image-view', [
    'inherit',
    'vow',
    'yandex-disk-base-view'
], function (provide, inherit, vow, BaseView) {

    var ImageView = inherit(BaseView, {
        toDataURL: function (type) {
            var defer = vow.defer(),
                reader = new FileReader();

            reader.onload = function (e) {
                defer.resolve(e.target.result);
            };
            reader.onerror = function (e) {
                defer.reject(e.target.error);
            };
            reader.onprogress = function (e) {
                defer.notify(
                    Math.round((e.loaded / e.total) * 100)
                );
            };

            this.toBlob(function (blob) {
                reader.readAsDataURL(blob);
            }, type);

            return defer.promise();
        },
        toImage: function (type) {
            var img = new Image();

            if(window.URL) {
                img.src = URL.createObjectURL(this.toBlob(type));
            }
            else {
                this.toDataURL(type)
                    .then(function (dataURL) {
                        img.src = dataURL;
                    });
            }

            return img;
        },
        toBlob: function (fn, type) {
            return fn(toBlob(this._data, type));
        }
    }, {
        dataURLtoBlob: function (dataURL) {
            var data = dataURL.split(';base64,');

            return toBlob(window.atob(data[1]), data[0].split(':')[1]);
        }
    });

    function toBlob(data, type) {
        var bytes = data.length,
            view = new Uint8Array(new ArrayBuffer(bytes));

        for(var i = 0; i < bytes; i++) {
            view[i] = data.charCodeAt(i);
        }

        return new Blob([ view.buffer ], { type: type || 'application\/octet-stream' });
    }

    provide(ImageView);
});

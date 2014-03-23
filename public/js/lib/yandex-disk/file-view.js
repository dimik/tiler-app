modules.define('yandex-disk-file-view', [
    'inherit',
    'yandex-disk-base-view'
], function (provide, inherit, BaseView) {

    var FileView = inherit(BaseView, {
        toUrl: function (type) {
            return (window.URL || window.webkitURL).createObjectURL(
                this.toBlob(type)
            );
        },
        toBlob: function (type) {
            return toBlob(this._data, type);
        },
        download: function () {
            window.location.assign(this.toUrl());
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

    provide(FileView);
});

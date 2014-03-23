modules.define('yandex-disk-base-view', [
    'inherit'
], function (provide, inherit) {

    var BaseView = inherit({
        __constructor: function (data) {
            this._data = data;
        },
        valueOf: function () {
            return this._data;
        }
    });

    provide(BaseView);
});

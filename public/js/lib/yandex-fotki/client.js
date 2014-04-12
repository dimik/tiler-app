modules.define('yandex-fotki-client', [
    'inherit',
    'jquery',
    'vow',
    'node-url',
    'yandex-fotki-model',
    'yandex-fotki-config'
], function (provide, inherit, jQuery, vow, url, Model, config) {

    var YandexFotkiClient = inherit({
        __constructor: function () {
            this._model = new Model();
        },
        getModel: function () {
            return this._model;
        },
        getPhotoUrl: function (photo) {
            return config.get('photoUrl') + url.parse(photo).path;
        },
        request: function (method, args) {
            var defer = vow.defer();

            this._model[method].apply(this._model, args)
                .then(function (res) {//, status, jqXHR) {
                    // var contentType = jqXHR.getResponseHeader('content-type');

                    defer.resolve(res);
                })
                .fail(function (err) {
                    defer.reject(err);
                });

            return defer.promise();
        },
    });

    provide(YandexFotkiClient);
});

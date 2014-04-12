modules.define('yandex-fotki-client', [
    'inherit',
    'jquery',
    'vow',
    'node-path',
    'yandex-fotki-model'
], function (provide, inherit, jQuery, vow, path, Model) {

    var YandexFotkiClient = inherit({
        __constructor: function () {
            this._model = new Model();
        },
        getModel: function () {
            return this._model;
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

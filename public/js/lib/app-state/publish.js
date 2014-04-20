modules.define('app-state-publish', [
    'inherit',
    'jquery',
    'jspath',
    'app-state-base',
    'ymaps-layout-layer-publish'
], function (provide, inherit, jQuery, jspath, AppStateBase, LayerPublishLayout) {

    var PublishState = inherit(AppStateBase, {
        __contructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'publish';
        },
        init: function () {
            var app = this._app;

            this._setupListeners();

            app.publishLayer()
                .then(function (data) {
                    app.popup
                        .render('layerPublish', {
                            url: jspath.apply('.propstat.prop.public_url[0]', data)
                        });
                });
        },
        destroy: function () {
            this._clearListeners();
            this._app.popup
                .clear();
        },
        _setupListeners: function () {
        },
        _clearListeners: function () {
        }
    });

    provide(PublishState);
});

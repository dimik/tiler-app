modules.define('app-state-publish', [
    'inherit',
    'jquery',
    'jspath',
    'app-state-base',
    'ymaps-layout-layer-publish'
], function (provide, inherit, jQuery, jspath, AppStateBase, LayerPublishLayout) {

    var PublishState = inherit(AppStateBase, {
        __contructor: function () {
            this._name = 'publish';
            this._title = 'Публикация слоя';

            this.__base.apply(this, arguments);
        },
        init: function () {
            this.__base.call(this);

            var app = this._app;

            app.addSourceLayer();
            app.publishLayer()
                .then(function (data) {
                    app.popup
                        .render('layerPublish', {
                            url: jspath.apply('.propstat.prop.public_url[0]', data)
                        });
                });
        },
        destroy: function () {
            var app = this._app;

            app.popup
                .clear();
            app.removeSourceLayer();

            this.__base.call(this);
        },
        _setupListeners: function () {
            this.__base.call(this);

            this._app.popup.events
                .add('cancel', this._onCancel, this);
        },
        _clearListeners: function () {
            this._app.sidebar.events
                .remove('cancel', this._onSetupCancel, this);

            this.__base.call(this);
        },
        _onCancel: function () {
            this._changeState('setup');
        }
    });

    provide(PublishState);
});

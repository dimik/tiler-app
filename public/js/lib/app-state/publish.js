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
            var app = this._app;

            app.popup.events
                .add('cancel', this._onCancel, this);
        },
        _clearListeners: function () {
            this._app.sidebar.events
                .remove('cancel', this._onSetupCancel, this);
        },
        _onCancel: function () {
            this._changeState('setup');
        }
    });

    provide(PublishState);
});

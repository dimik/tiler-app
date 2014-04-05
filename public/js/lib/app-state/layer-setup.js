modules.define('app-state-layer-setup', [
    'inherit',
    'jquery',
    'app-state-base'
], function (provide, inherit, jQuery, AppStateBase) {

    var LayerSetupState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'layer-setup';
        },
        init: function () {
            var app = this._app;

            this._attachHandlers();
            app.sidebar.render(app.options.getAll());
            app.renderSourceLayer();
        },
        destroy: function () {
            this._detachHandlers();
            this._app.sidebar.clear();
        },
        _attachHandlers: function () {
            this._app.sidebar.events.on({
                submit: jQuery.proxy(this._onSetupSubmit, this),
                change: jQuery.proxy(this._onSetupChange, this),
                cancel: jQuery.proxy(this._onSetupCancel, this)
            });
        },
        _detachHandlers: function () {
            this._app.sidebar.events.off();
        },
        _onSetupSubmit: function (e) {
            this._changeState('layer-process');
        },
        _onSetupChange: function (e) {
            this._app.options.set(e.settings);
        },
        _onSetupCancel: function (e) {
            this._changeState('image-load');
        }
    });

    provide(LayerSetupState);
});

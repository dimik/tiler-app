modules.define('app-state-layer-setup', [
    'inherit',
    'jquery',
    'app-state-base',
    'ymaps-layout-layer-settings'
], function (provide, inherit, jQuery, AppStateBase, LayerSettingsLayout) {

    var LayerSetupState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'layer-setup';
        },
        init: function () {
            var app = this._app;

            this._setupListeners();
            app.sidebar
                .render('setup', app.options.getAll());
            app.renderSourceLayer();
        },
        destroy: function () {
            this._clearListeners();
            this._app.sidebar
                .clear();
        },
        _setupListeners: function () {
            this._app.sidebar.events
                .add('submit', this._onSetupSubmit, this)
                .add('change', this._onSetupChange, this)
                .add('cancel', this._onSetupCancel, this);
        },
        _clearListeners: function () {
            this._app.sidebar.events
                .remove('submit', this._onSetupSubmit, this)
                .remove('change', this._onSetupChange, this)
                .remove('cancel', this._onSetupCancel, this);
        },
        _onSetupSubmit: function (e) {
            this._changeState('layer-process');
        },
        _onSetupChange: function (e) {
            this._app.options.set(e.get('settings'));
        },
        _onSetupCancel: function (e) {
            this._changeState('image-load');
        }
    });

    provide(LayerSetupState);
});

define([
    'jquery',
    'app-state-base',
    'app-state-image-load',
    'app-state-layer-process'
], function (jQuery, StateBase, ImageLoadState, LayerProcessState) {

    function LayerSetupState(app) {
        this._name = 'layer-setup';

        StateBase.apply(this, arguments);
    }

    jQuery.extend(LayerSetupState.prototype, StateBase.prototype, {
        contructor: LayerSetupState,
        init: function () {
            var app = this._app;

            this._attachHandlers();
            app.setData({
                maxZoom: app.getTileSource().getZoomBySource()
            });
            app.sidebar.render(app.getData());
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
            this._changeState(LayerProcessState);
        },
        _onSetupChange: function (e) {
            var app = this._app,
                settings = e.settings;

            app.tiler.setOptions({ output: settings.layerName });
            app.setData({
                tileBackground: settings.tileBackground,
                minZoom: ~~settings.minZoom,
                maxZoom: ~~settings.maxZoom,
                tileType: settings.tileType,
                tileOpacity: settings.tileOpacity / 100
            });
        },
        _onSetupCancel: function (e) {
            this._changeState(ImageLoadState);
        }
    });

    return LayerSetupState;
});

define([
    'jquery',
    'inherit',
    'app-state-base'
], function (jQuery, inherit, AppStateBase) {

    return inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'layer-setup';
        },
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
            this._changeState('layer-process');
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
            this._changeState('image-load');
        }
    });
});

define([
    'jquery',
    'app-state-base',
    'app-state-layer-setup',
    'app-state-layer-code'
], function (jQuery, StateBase, LayerSetupState, LayerCodeState) {

    function LayerProcessState(app) {
        this._name = 'layer-process';

        StateBase.apply(this, arguments);
    }

    jQuery.extend(LayerProcessState.prototype, StateBase.prototype, {
        contructor: LayerProcessState,
        init: function () {
            var app = this._app;

            this._attachHandlers();

            app.preloader.render({
                progress: 0
            });

            app.tiler
                .setTileSource(app.getTileSource())
                .render()
                .done(
                    this._onComplete,
                    this._onError,
                    this._onProgress,
                    this
                );
        },
        destroy: function () {
            this._app.preloader.clear();
            this._detachHandlers();
        },
        _attachHandlers: function () {
            this._app.sidebar.events.on({
                cancel: jQuery.proxy(this._onProcessCancel, this)
            });
        },
        _detachHandlers: function () {
            this._app.sidebar.events.off();
        },
        _onComplete: function (res) {
            this._changeState(LayerCodeState);
        },
        _onProgress: function (v) {
            this._app.preloader.render(v);
        },
        _onError: function () {
            this._app.popup.render({
                content: err
            });
            this._changeState(LayerSetupState);
        },
        _onCancel: function (e) {
            this._changeState(LayerSetupState);
        }
    });

    return LayerProcessState;
});

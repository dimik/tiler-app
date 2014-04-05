modules.define('app-state-layer-process', [
    'inherit',
    'jquery',
    'app-state-base'
], function (provide, inherit, jQuery, AppStateBase) {

    var LayerProcessState = inherit(AppStateBase, {
        __contructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'layer-process';
        },
        init: function () {
            var app = this._app;

            this._attachHandlers();

            app.preloader.render({
                progress: 0
            });

            app.tiler
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
            this._changeState('layer-code');
        },
        _onProgress: function (v) {
            this._app.preloader.render(v);
        },
        _onError: function (err) {
            var message = err.status?
                err.status + ' ' + err.statusText : err.message;

            this._app.preloader.clear();
            this._app.popup.render({
                content: message
            });
            this._changeState('layer-setup');
        },
        _onCancel: function (e) {
            this._changeState('layer-setup');
        }
    });

    provide(LayerProcessState);
});

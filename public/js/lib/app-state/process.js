modules.define('app-state-process', [
    'inherit',
    'jquery',
    'app-state-base',
    'ymaps-layout-preloader'
], function (provide, inherit, jQuery, AppStateBase, PreloaderLayout) {

    var ProcessState = inherit(AppStateBase, {
        __constructor: function () {
            this._name = 'process';
            this._title = 'Обработка изображения';

            this.__base.apply(this, arguments);
        },
        init: function () {
            this.__base.call(this);

            var app = this._app;

            app.addSourceLayer();
            app.popup
                .render('preloader', {
                    progress: 0,
                    message: 'starting'
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
            var app = this._app;

            app.popup
                .clear();
            app.tiler
                .cancel();
            app.removeSourceLayer();

            this.__base.call(this);
        },
        _setupListeners: function () {
            this.__base.call(this);

            var app = this._app;

            app.sidebar.events
                .add('cancel', this._onSetupCancel, this);
            app.popup.events
                .add('cancel', this._onCancel, this);
        },
        _clearListeners: function () {
            var app = this._app;

            app.popup.events
                .remove('cancel', this._onCancel, this);
            app.sidebar.events
                .remove('cancel', this._onSetupCancel, this);

            this.__base.call(this);
        },
        _onComplete: function (res) {
            this._changeState('publish');
        },
        _onProgress: function (v) {
            this._app.popup
                .setData(v);
        },
        _onError: function (err) {
            var app = this._app,
                message = err.statusText || err.message;

            app.tiler
                .cancel();

            app.popup
                .clear()
                .render('alert', {
                    content: message
                });
        },
        _onCancel: function () {
            this._changeState('setup');
        },
        _onSetupCancel: function (e) {
            this._changeState('load');
        }
    });

    provide(ProcessState);
});

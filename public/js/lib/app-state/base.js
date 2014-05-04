modules.define('app-state-base', [
    'inherit',
    'jquery'
], function (provide, inherit, jQuery) {

    var BaseState = inherit({
        __constructor: function (app) {
            this._app = app;
            this.init();
        },
        getName: function () {
            return this._name;
        },
        getTitle: function () {
            return this._title;
        },
        getUrl: function () {
            return '#' + encodeURI(this._name);
        },
        init: function () {
            window.history.pushState({ name: this.getName() }, this.getTitle(), this.getUrl());
            this._setupListeners();
        },
        destroy: function () {
            this._clearListeners();
        },
        _setupListeners: function () {
            jQuery(window).on('popstate', jQuery.proxy(function (e) {
                this._changeState(e.originalEvent.state.name);
            }, this));
        },
        _clearListeners: function () {
            jQuery(window).off('popstate');
        },
        _changeState: function (state) {
            this.destroy();
            this._app.setState(state);
        }
    });

    provide(BaseState);
});

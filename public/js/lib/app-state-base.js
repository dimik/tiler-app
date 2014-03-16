define(function () {
    function AppStateBase(app) {
        this._app = app;
        this.init();
    }

    AppStateBase.prototype = {
        constructor: AppStateBase,
        getName: function () {
            return this._name;
        },
        init: function () {},
        destroy: function () {},
        _changeState: function (AppState) {
            this.destroy();
            this._app.setState(new AppState(this._app));
        }
    };

    return AppStateBase;
});

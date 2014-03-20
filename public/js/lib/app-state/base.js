define([
    'inherit'
], function (inherit) {

    return inherit({
        __constructor: function (app) {
            this._app = app;
            this.init();
        },
        getName: function () {
            return this._name;
        },
        init: function () {},
        destroy: function () {},
        _changeState: function (state) {
            this.destroy();
            this._app.setState(state);
        }
    });
});

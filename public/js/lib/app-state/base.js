modules.define('app-state-base', [
    'inherit'
], function (provide, inherit) {

    provide(
        inherit({
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
        })
    );
});

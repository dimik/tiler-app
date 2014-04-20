modules.define('app-state-factory', [
    'inherit',
    'app-state-login',
    'app-state-load',
    'app-state-setup',
    'app-state-process',
    'app-state-publish'
], function (provide, inherit, LoginState, LoadState, SetupState, ProcessState, PublishState) {

    var StateFactory = inherit({
        __constructor: function (app) {
            this._app = app;
            this._states = {
                "login": LoginState,
                "load": LoadState,
                "setup": SetupState,
                "process": ProcessState,
                "publish": PublishState
            };
        },
        create: function (state) {
            return new this._states[state](this._app);
        }
    });

    provide(StateFactory);
});

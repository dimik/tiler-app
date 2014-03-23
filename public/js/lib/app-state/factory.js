modules.define('app-state-factory', [
    'inherit',
    'app-state-user-auth',
    'app-state-image-load',
    'app-state-layer-setup',
    'app-state-layer-process',
    'app-state-layer-code'
], function (provide, inherit, UserAuthState, ImageLoadState, LayerSetupState, LayerProcessState, LayerCodeState) {

    var StateFactory = inherit({
        __constructor: function (app) {
            this._app = app;
            this._states = {
                "user-auth": UserAuthState,
                "image-load": ImageLoadState,
                "layer-setup": LayerSetupState,
                "layer-process": LayerProcessState,
                "layer-code": LayerCodeState
            };
        },
        create: function (state) {
            return new this._states[state](this._app);
        }
    });

    provide(StateFactory);
});

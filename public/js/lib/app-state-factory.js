define([
    'app-state-user-auth',
    'app-state-image-load',
    'app-state-layer-setup',
    'app-state-layer-process',
    'app-state-layer-code',
], function (UserAuthState, ImageLoadState, LayerSetupState, LayerProcessState, LayerCodeState) {

    function AppStateFactory(app) {
        this._app = app;
        this._states = {
            "user-auth": UserAuthState,
            "image-load": ImageLoadState,
            "layer-setup": LayerSetupState,
            "layer-process": LayerProcessState,
            "layer-code": LayerCodeState
        };
    }

    AppStateFactory.prototype.create = function (state) {
        return new this._states[state](this._app);
    };

    return AppStateFactory;
});

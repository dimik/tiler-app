define([
    'jquery',
    'app-state-base',
    'app-state-image-load'
], function (jQuery, StateBase, ImageLoadState) {

    function StateAuth(app) {
        StateBase.apply(this, arguments);

        this._name = 'auth';
        this._changeState(ImageLoadState);
    }

    jQuery.extend(StateAuth.prototype, StateBase.prototype, {
        constructor: StateAuth
    });

    return StateAuth;
});

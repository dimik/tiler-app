define([
    'jquery',
    'inherit',
    'app-state-base'
], function (jQuery, inherit, AppStateBase) {

    return inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'user-auth';
            this._changeState('image-load');
        }
    });
});

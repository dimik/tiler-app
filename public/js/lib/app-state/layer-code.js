define([
    'jquery',
    'inherit',
    'app-state-base'
], function (jQuery, inherit, AppStateBase) {

    return inherit(AppStateBase, {
        __contructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'layer-code';
        },
        init: function () {
            this._attachHandlers();
        },
        destroy: function () {
            this._detachHandlers();
        },
        _attachHandlers: function () {
        },
        _detachHandlers: function () {
        }
    });
});

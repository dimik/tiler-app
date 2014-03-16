define([
    'jquery',
    'app-state-base'
], function (jQuery, StateBase) {

    function LayerCodeState(app) {
        this._name = 'layer-code';

        StateBase.apply(this, arguments);
    }

    jQuery.extend(LayerCodeState.prototype, StateBase.prototype, {
        contructor: LayerCodeState,
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

    return LayerCodeState;
});

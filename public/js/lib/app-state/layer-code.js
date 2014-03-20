modules.define('app-state-image-load', [
    'inherit',
    'jquery',
    'app-state-base'
], function (provide, inherit, jQuery, AppStateBase) {

    provide(
        inherit(AppStateBase, {
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
        })
    );
});

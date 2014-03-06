define([
    'ready!ymaps',
    './base',
    './layout/layer-settings',
    'jquery',
    'module'
], function (ymaps, BaseControl, LayerSettingsLayout, jQuery, module) {

var config = module.config();

/**
 * @class
 * @name SidebarControl
 */
function SidebarControl(parameters) {
    BaseControl.apply(this, arguments);

    this.options.set({
        contentLayout: LayerSettingsLayout,
        float: 'none',
        position: { top: 0, right: 0 }
    });
}

ymaps.util.augment(SidebarControl, BaseControl, {
    _init: function (el) {
        this.constructor.superclass._init.apply(this, arguments);

        this._attachHandlers();
    },
    _destroy: function () {
        this._detachHandlers();

        this.constructor.superclass._destroy.apply(this, arguments);
    },
    _attachHandlers: function () {
    },
    _detachHandlers: function () {
    }
});

return SidebarControl;

});

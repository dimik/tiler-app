modules.define('ymaps-control-sidebar', [
    'inherit',
    'ymaps',
    'ymaps-control-base',
    'ymaps-layout-layer-settings',
    'ymaps-layout-image-status',
    'ymaps-layout-tile-type',
    'ymaps-layout-tile-color'
], function (provide, inherit, ymaps, BaseControl, LayerSettingsLayout, ImageStatusLayout, TileTypeLayout, TileColorLayout) {

    var SidebarControl = inherit(BaseControl, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this.options.set({
                contentLayout: LayerSettingsLayout,
                imageStatusLayout: ImageStatusLayout,
                tileTypeLayout: TileTypeLayout,
                tileColorLayout: TileColorLayout,
                float: 'none',
                position: { top: 0, right: 0 }
            });
        },
        _init: function (el) {
            this.__base.apply(this, arguments);

            this._attachHandlers();
        },
        _destroy: function () {
            this._detachHandlers();

            this.__base.apply(this, arguments);
        },
        _attachHandlers: function () {
        },
        _detachHandlers: function () {
        }
    });

    provide(SidebarControl);
});

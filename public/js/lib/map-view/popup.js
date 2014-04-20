modules.define('map-view-popup', [
    'inherit',
    'map-view-base',
    'ymaps-map',
    'ymaps-control-centered'
], function (provide, inherit, BaseMapView, map, CenteredControl) {

    var PopupMapView = inherit(BaseMapView, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'popup';
        },
        _createControl: function (params) {
            var control = new CenteredControl(params);

            map.controls.add(control);
            control.events.setParent(this.events);

            return control;
        }
    });

    provide(PopupMapView);
});

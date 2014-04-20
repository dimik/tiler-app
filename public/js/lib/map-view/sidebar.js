modules.define('map-view-sidebar', [
    'inherit',
    'map-view-base',
    'ymaps',
    'ymaps-map',
    'ymaps-control-sidebar'
], function (provide, inherit, BaseMapView, ymaps, map, SidebarControl) {

    var SidebarMapView = inherit(BaseMapView, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'sidebar';
        },
        setData: function (data) {
            return this.__base.call(this, ymaps.util.extend(data, {
                imageSize: this._formatImageSize(data.imageSize),
                imageName: this._formatImageName(data.imageName),
                tileOpacity: data.tileOpacity * 100
            }));
        },
        _createControl: function (params) {
            var control = new SidebarControl(params);

            map.controls.add(control);
            control.events.setParent(this.events);

            return control;
        },
        _formatImageName: function (name) {
            var begin = name.substr(0, 5),
                end = name.substr(-5);

            if(name.length > 10) {
                return begin + '&hellip;' + end;
            }

            return name;
        },
        _formatImageSize: function (size) {
            var kb = size / 1024,
                mb = kb / 1024;

            if(mb > 1) {
                return mb.toFixed(2) + '&nbsp;мбaйт';
            }
            else if(kb > 1) {
                return Math.ceil(kb) + '&nbsp;кбайт';
            }
            else {
                return size + '&nbsp;байт';
            }
        }
    });

    provide(SidebarMapView);
});

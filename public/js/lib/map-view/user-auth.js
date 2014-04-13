modules.define('map-view-user-auth', [
    'inherit',
    'jquery',
    'ymaps',
    'ymaps-map',
    'ymaps-control-centered',
    'ymaps-layout-user-auth'
], function (provide, inherit, jQuery, ymaps, map, CenteredControl, UserAuthLayout) {

    var ImageReaderMapView = inherit({
        __constructor: function () {
            this.events = jQuery({});
            this._control = this._createControl();
        },
        render: function (data) {
            map.controls.add(this._control);

            if(data) {
                this._control.data.set(data);
            }

            return this;
        },
        clear: function () {
            map.controls.remove(this._control);

            return this;
        },
        show: function () {
            this._control.options.set('visible', true);

            return this;
        },
        hide: function () {
            this._control.options.set('visible', false);

            return this;
        },
        _createControl: function (data, options) {
            return new CenteredControl({
                data: data,
                options: {
                    float: 'none',
                    contentBodyLayout: UserAuthLayout
                }
            });
        }
    });

    provide(ImageReaderMapView);
});

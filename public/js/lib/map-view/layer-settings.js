modules.define('map-view-layer-settings', [
    'inherit',
    'jquery',
    'ymaps',
    'ymaps-map',
    'ymaps-control-sidebar'
], function (provide, inherit, jQuery, ymaps, map, SidebarControl) {

    var LayerSettingsMapView = inherit({
        __constructor: function () {
            this.events = jQuery({});
            this._control = this._createControl();
        },
        render: function (data) {
            map.controls.add(this._control);
            if(data) {
                jQuery.extend(data, {
                    imageSize: this._formatImageSize(data.imageSize),
                    imageName: this._formatImageName(data.imageName),
                    tileOpacity: data.tileOpacity * 100
                });
                this._control.data.set(data);
            }
            this._attachHandlers();

            return this;
        },
        clear: function () {
            this._detachHandlers();
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
            return new SidebarControl({
                data: data,
                options: {
                    float: 'none',
                    position: { right: 0, top: 0 }
                }
            });
        },
        _attachHandlers: function () {
            this._control.events
                .add('submit', this._onSubmit, this)
                .add('cancel', this._onCancel, this)
                .add('change', this._onChange, this);
        },
        _detachHandlers: function () {
            this._control.events
                .remove('change', this._onChange, this)
                .remove('cancel', this._onCancel, this)
                .remove('submit', this._onSubmit, this);
        },
        _onSubmit: function (e) {
            this._control.state.set('submitted', true);
            this.events.trigger(jQuery.Event('submit', {
                settings: e.get('settings')
            }));
        },
        _onCancel: function (e) {
            this.events.trigger(jQuery.Event('cancel', {}));
        },
        _onChange: function (e) {
            this.events.trigger(jQuery.Event('change', {
                settings: e.get('settings')
            }));
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

    provide(LayerSettingsMapView);
});

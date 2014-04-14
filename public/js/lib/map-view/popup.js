modules.define('map-view-popup', [
    'inherit',
    'ymaps',
    'ymaps-map',
    'ymaps-control-centered'
], function (provide, inherit, ymaps, map, CenteredControl) {

    var PopupMapView = inherit({
        __constructor: function () {
            this.events = new ymaps.event.Manager();

            map.controls.add(
                this._control = this._createControl()
            );
        },
        render: function (preset, data) {
            this.setPreset(preset)
                .setData(data);

            return this;
        },
        clear: function () {
            this.clearPreset()
                .clearData();

            return this;
        },
        listen: function (events) {
            this._setupListeners(events);

            return this;
        },
        unlisten: function () {
            this._clearListeners();

            return this;
        },
        show: function () {
            this._control.options
                .set('visible', true);

            return this;
        },
        hide: function () {
            this._control.options
                .set('visible', false);

            return this;
        },
        setPreset: function (preset) {
            this._control.options
                .set('preset', preset);

            return this;
        },
        clearPreset: function () {
            this._control.options
                .unset('preset');

            return this;
        },
        setData: function (data) {
            if(data) {
                this._control.data
                    .set(data);
            }

            return this;
        },
        clearData: function () {
            this._control.data
                .unsetAll();

            return this;
        },
        _createControl: function (data, options) {
            return new CenteredControl({
                data: data,
                options: {
                    float: 'none'
                }
            });
        },
        _setupListeners: function (events) {
            this._listeners = this._control.events.group()
                .add(events, this._onEvent, this);
        },
        _clearListeners: function () {
            if(this._listeners) {
                this._listeners.removeAll();
                this._listeners = null;
            }
        },
        _onEvent: function (e) {
            this.events.fire(e.get('type'), e);
        }
    });

    provide(PopupMapView);
});

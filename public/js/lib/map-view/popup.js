modules.define('map-view-popup', [
    'inherit',
    'ymaps',
    'ymaps-map',
    'ymaps-control-centered'
], function (provide, inherit, ymaps, map, CenteredControl) {

    var PopupMapView = inherit({
        __constructor: function () {
            this.events = new ymaps.event.Manager();

            this._name = 'popup';
            this._control = this._createControl();
        },
        render: function (preset, data) {
            this.setPreset(this._name + '#' + preset)
                .setData(data);

            return this;
        },
        clear: function () {
            this.clearPreset()
                .clearData();

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
        _createControl: function () {
            var control = new CenteredControl();

            control.events.setParent(this.events);
            map.controls.add(control);

            return control;
        }
    });

    provide(PopupMapView);
});

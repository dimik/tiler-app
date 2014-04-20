modules.define('map-view-base', [
    'inherit',
    'ymaps',
    'ymaps-map'
], function (provide, inherit, ymaps) {

    var BaseMapView = inherit({
        __constructor: function () {
            this.events = new ymaps.event.Manager();

            this._control = this._createControl();
        },
        render: function (preset, data) {
            this
                .setData(data)
                .setPreset(this._name + '#' + preset);

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
        _createControl: function (params) {}
    });

    provide(BaseMapView);
});

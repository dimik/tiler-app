define([
    'ready!ymaps',
    'ym/control/centered',
    'ym/control/layout/preloader',
    'jquery',
    'module'
], function (ymaps, CenteredControl, PreloaderLayout, jQuery, module) {

var config = module.config();

function PreloaderMapView(map) {
    this.events = jQuery({});
    this._map = map;
    this._control = this._createControl();
}

PreloaderMapView.prototype = {
    constructor: PreloaderMapView,
    render: function (data) {
        if(!this._control.getParent()) {
            this._map.controls.add(this._control);
        }

        if(data) {
            this._control.data.set(data);
        }

        return this;
    },
    clear: function () {
        this._map.controls.remove(this._control);

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
                contentBodyLayout: PreloaderLayout
            }
        });
    }
};

return PreloaderMapView;

});
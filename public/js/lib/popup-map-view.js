define([
    'ready!ymaps',
    'ym/control/centered',
    'ym/control/layout/popup',
    'jquery',
    'module'
], function (ymaps, CenteredControl, PopupLayout, jQuery, module) {

var config = module.config();

function ImageReaderMapView(map) {
    this.events = jQuery({});
    this._map = map;
    this._control = this._createControl();
    this._timeoutId == null;
    this._data = null;
}

ImageReaderMapView.prototype = {
    constructor: ImageReaderMapView,
    render: function (data) {
        this._map.controls.add(this._control);
        this._attachHandlers();

        this._timeoutId = window.setTimeout(function () {
            this._fireEvent('cancel');
            this.clear();
        }.bind(this), 3000);

        if(data) {
            this._data = data;
            this._control.data.set(data);
        }

        return this;
    },
    clear: function () {
        this._detachHandlers();
        this._map.controls.remove(this._control);
        this._data = null;
        if(this._timeoutId) {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = null;
        }

        return this;
    },
    getData: function () {
        return this._data;
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
                contentBodyLayout: PopupLayout
            }
        });
    },
    _attachHandlers: function () {
        this._control.events
            .add('cancel', this._onCancel, this);
    },
    _detachHandlers: function () {
        this._control.events
            .remove('cancel', this._onCancel, this);
    },
    _onCancel: function (e) {
        this._fireEvent('cancel');
        this.clear();
    },
    _fireEvent: function (e, data) {
        this.events.trigger(jQuery.Event(e, data));
    }
};

return ImageReaderMapView;

});

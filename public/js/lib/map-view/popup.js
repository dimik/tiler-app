modules.define('map-view-popup', [
    'inherit',
    'jquery',
    'ymaps',
    'ymaps-map',
    'ymaps-control-centered',
    'ymaps-layout-popup'
], function (provide, inherit, jQuery, ymaps, map, CenteredControl, PopupLayout) {

    provide(
        inherit({
            __constructor: function () {
                this.events = jQuery({});
                this._control = this._createControl();
                this._timeoutId == null;
                this._data = null;
            },
            render: function (data) {
                map.controls.add(this._control);
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
                map.controls.remove(this._control);
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
        });
    );
});

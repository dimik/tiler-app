define([
    'ready!ymaps',
    'ym/control/centered',
    'ym/control/layout/image-loader',
    'jquery',
    'module'
], function (ymaps, CenteredControl, ImageLoaderLayout, jQuery, module) {

var config = module.config();

function ImageReaderMapView(map) {
    this.events = jQuery({});
    this._map = map;
    this._control = this._createControl();
    this._source = null;
    this._data = null;
}

ImageReaderMapView.prototype = {
    constructor: ImageReaderMapView,
    render: function (data) {
        this._map.controls.add(this._control);
        this._attachHandlers();

        if(data) {
            this._data = data;
            this._control.data.set(data);
        }

        return this;
    },
    clear: function () {
        this._detachHandlers();
        this._map.controls.remove(this._control);
        this._source = null;
        this._data = null;

        return this;
    },
    getData: function () {
        return this._data;
    },
    getSource: function () {
        return this._source;
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
                contentBodyLayout: ImageLoaderLayout
            }
        });
    },
    _attachHandlers: function () {
        this._control.events
            .add('load', this._onLoad, this)
            .add('submit', this._onSubmit, this)
            .add('cancel', this._onCancel, this);
    },
    _detachHandlers: function () {
        this._control.events
            .remove('cancel', this._onCancel, this)
            .remove('submit', this._onSubmit, this)
            .remove('load', this._onLoad, this);
    },
    _onLoad: function (e) {
        var source = this._source = e.get('source');

        switch(source.type) {
            case 'image/png':
            case 'image/jpeg':
            case 'image/gif':
                this.events.trigger($.Event('load', {
                    source: source
                }));
                break;
            default:
                this.events.trigger($.Event('error', {
                    message: source.type.indexOf('image/') === 0?
                        'Формат изображения "<strong>' + source.type + '</strong>"<br/>не поддерживается данным приложением' :
                        'Переданный файл не является изображением'
                }));
        }
    },
    _onSubmit: function (e) {
        this.events.trigger($.Event('submit', {
            source: this._source
        }));
    },
    _onCancel: function (e) {
        this._control.options.set('contentBodyLayout', ImageLoaderLayout);
        this.events.trigger($.Event('cancel', {}));
    }
};

return ImageReaderMapView;

});

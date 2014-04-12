modules.define('map-view-image-reader', [
    'inherit',
    'jquery',
    'ymaps',
    'ymaps-map',
    'ymaps-control-centered',
    'ymaps-layout-file-image-loader',
    'ymaps-layout-fotki-image-loader',
    'ymaps-layout-fotki-album-selector',
    'ymaps-layout-fotki-tag-selector',
    'ymaps-layout-fotki-photo-list'
], function (provide, inherit, jQuery, ymaps, map, CenteredControl, FileImageLoaderLayout, FotkiImageLoaderLayout, FotkiAlbumSelectorLayout, FotkiTagSelectorLayout, FotkiPhotoListLayout) {

    var ImageReaderMapView = inherit({
        __constructor: function () {
            this.events = jQuery({});
            this._control = this._createControl();
            this._stateMonitor = new ymaps.Monitor(this._control.state);
        },
        render: function (data) {
            map.controls.add(this._control);
            this._attachHandlers();

            if(data) {
                this._control.data.set(data);
            }

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
            return new CenteredControl({
                data: data,
                state: {
                    loader: 'file'
                },
                options: {
                    float: 'none',
                    contentBodyLayout: FileImageLoaderLayout,
                    fotkiAlbumSelectorLayout: FotkiAlbumSelectorLayout,
                    fotkiTagSelectorLayout: FotkiTagSelectorLayout,
                    fotkiPhotoListLayout: FotkiPhotoListLayout
                }
            });
        },
        _attachHandlers: function () {
            this._stateMonitor
                .add('loader', this._onLoaderChange, this);

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
            this._stateMonitor
                .removeAll();
        },
        _onLoad: function (e) {
            var image = e.get('image');

            switch(image.type) {
                case 'image/png':
                case 'image/jpeg':
                case 'image/gif':
                    this.events.trigger(jQuery.Event('load', {
                        image: image
                    }));
                    break;
                default:
                    this.events.trigger(jQuery.Event('error', {
                        message: image.type.indexOf('image/') === 0?
                            'Формат изображения "<strong>' + image.type + '</strong>"<br/>не поддерживается данным приложением' :
                            'Переданный файл не является изображением'
                    }));
            }
        },
        _onLoaderChange: function (loader) {
            this._control.options.set('contentBodyLayout', loader == 'file'?
                FileImageLoaderLayout : FotkiImageLoaderLayout
            );
        }
    });

    provide(ImageReaderMapView);
});

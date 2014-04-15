modules.define('app-state-image-load', [
    'inherit',
    'jquery',
    'app-state-base',
    'ymaps-layout-file-image-loader',
    'ymaps-layout-fotki-image-loader',
    'ymaps-layout-alert'
], function (provide, inherit, jQuery, AppStateBase, FileImageLoaderLayout, FotkiImageLoaderLayout, AlertLayout) {

    var ImageLoadState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'image-load';
        },
        init: function () {
            this._setupListeners();
            this._app.popup
                .render('fileImageLoader');
        },
        destroy: function () {
            this._clearListeners();
            this._app.popup
                .clear();
        },
        _setupListeners: function () {
            this._app.popup
                .events
                    .add('load', this._onImageLoad, this)
                    .add('loaderchange', this._onLoaderChange, this)
                    .add('error', this._onImageError, this);
        },
        _clearListeners: function () {
            this._app.popup
                .events
                    .remove('error', this._onImageError, this)
                    .remove('loaderchange', this._onLoaderChange, this)
                    .remove('load', this._onImageLoad, this);
        },
        _onImageLoad: function (e) {
            var app = this._app,
                imageData = e.get('image'),
                tileSource = app.tiler.getTileSource();

            app.tiler.openSource(imageData.url)
                .done(function (res) {
                    app.options.set({
                        imageUrl: res.src,
                        imageName: imageData.name,
                        imageType: imageData.type,
                        imageSize: imageData.size,
                        imageWidth: res.width,
                        imageHeight: res.height,
                        tileType: imageData.type,
                        layerMinZoom: tileSource.getMinZoom(),
                        layerMaxZoom: tileSource.getMaxZoom()
                    });
                    this._changeState('layer-setup');
                }, this);
        },
        _onImageError: function (e) {
            var app = this._app;

            app.popup
                .clear()
                .render('alert', {
                    content: e.get('message')
                })
                .events
                    .add('cancel', function () {
                    });
        },
        _onLoaderChange: function (e) {
            this._app.popup
                .render(e.get('loader') + 'ImageLoader');
        }
    });

    provide(ImageLoadState);
});

modules.define('app-state-image-load', [
    'inherit',
    'jquery',
    'app-state-base'
], function (provide, inherit, jQuery, AppStateBase) {

    var ImageLoadState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'image-load';
        },
        init: function () {
            this._attachHandlers();
            this._app.reader.render();
        },
        destroy: function () {
            this._detachHandlers();
            this._app.reader.clear();
        },
        _attachHandlers: function () {
            this._app.reader.events.on({
                load: jQuery.proxy(this._onImageLoad, this),
                error: jQuery.proxy(this._onImageError, this)
            });
        },
        _detachHandlers: function () {
            this._app.reader.events.off();
        },
        _onImageLoad: function (e) {
            var app = this._app,
                tileSource = app.tiler.getTileSource();

            app.tiler.openSource(e.image.url)
                .done(function (res) {
                    app.options.set({
                        imageUrl: res.src,
                        imageName: e.image.name,
                        imageType: e.image.type,
                        imageSize: e.image.size,
                        imageWidth: res.width,
                        imageHeight: res.height,
                        tileType: e.image.type,
                        layerMinZoom: tileSource.getMinZoom(),
                        layerMaxZoom: tileSource.getMaxZoom()
                    });
                    this._changeState('layer-setup');
                }, this);
        },
        _onImageError: function (e) {
            var app = this._app;

            app.reader.clear();
            app.popup
                .render({
                    content: e.message
                })
                .events
                    .on('cancel', function () {
                        app.reader.render();
                    });
        }
    });

    provide(ImageLoadState);
});

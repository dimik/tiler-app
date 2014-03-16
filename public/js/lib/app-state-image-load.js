define([
    'jquery',
    'app-state-base',
    'app-state-layer-setup'
], function (jQuery, StateBase, LayerSetupState) {

    function ImageLoadState(app) {
        this._name = 'image-load';

        StateBase.apply(this, arguments);
    }

    jQuery.extend(ImageLoadState.prototype, StateBase.prototype, {
        constructor: ImageLoadState,
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
            var app = this._app;

            app.getTileSource().open(URL.createObjectURL(e.source))
                .done(function (res) {
                    URL.revokeObjectURL(e.source);
                    app.setData({
                        imageUrl: res.src,
                        imageName: e.source.name,
                        imageType: e.source.type,
                        imageSize: e.source.size,
                        imageWidth: res.width,
                        imageHeight: res.height,
                        tileType: e.source.type
                    });
                    this._changeState(LayerSetupState);
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

    return ImageLoadState;
});

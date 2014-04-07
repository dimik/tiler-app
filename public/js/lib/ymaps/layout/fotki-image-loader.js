modules.define('ymaps-layout-fotki-image-loader', [
    'ymaps',
    'jquery',
    'vow',
    'yandex-fotki-client'
], function (provide, ymaps, jQuery, vow, YandexFotkiClient) {

    var FotkiImageLoaderLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well fotki-image-loader">',
            '<div class="row-fluid">',
                '<div class="control-group">',

                    '{% include options.fotkiAlbumSelectorLayout %}',

                    '{% include options.fotkiTagSelectorLayout %}',

                '</div>',
            '</div>',
            '<div class="row-fluid">',
            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            this.constructor.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            var client = this._client = new YandexFotkiClient();

            client.request('stat')
                .then(function (res) {
                    return vow.all([
                        client.request('albums'),
                        client.request('tags'),
                        client.request('photos')
                    ]);
                })
                .spread(function (albums, tags, photos) {
                    debugger;
                    this.setData({ data: {
                        albums: albums,
                        tags: tags,
                        photos: photos
                    }});
                }, this);

            this._attachHandlers();
        },
        clear: function () {
            this._detachHandlers();

            this.constructor.superclass.build.apply(this, arguments);
        },
        _attachHandlers: function () {
        },
        _detachHandlers: function () {
        }
    });

    provide(FotkiImageLoaderLayout);
});

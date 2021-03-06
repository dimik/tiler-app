modules.define('ymaps-layout-fotki-image-loader', [
    'ymaps',
    'jquery',
    'vow',
    'yandex-fotki-client',
    'ymaps-layout-fotki-album-selector',
    'ymaps-layout-fotki-tag-selector',
    'ymaps-layout-fotki-photo-list'
], function (provide, ymaps, jQuery, vow, YandexFotkiClient, AlbumSelectorLayout, TagSelectorLayout, PhotoListLayout) {

    var FotkiImageLoaderLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well well-white fotki-image-loader">',
            '<a class="close" href="#" data-loader="file">&times;</a>',
            '<div class="row-fluid">',
                '<form class="form-inline" style="padding-left: 15px;">',

                    '<span class="help-inline">Выберите&nbsp;</span>',

                    '{% include options.albumSelectorLayout %}',

                    '<span class="help-inline">&nbsp;или&nbsp;</span>',

                    '{% include options.tagSelectorLayout %}',

                '</form>',
            '</div>',
            '<div class="row-fluid" style="height:400px;overflow:scroll;">',

                '{% include options.photoListLayout %}',

            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            FotkiImageLoaderLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());
            this._stateMonitor = new ymaps.Monitor(this.getData().control.state);
            this._client = new YandexFotkiClient();
            this._loadData();
            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            FotkiImageLoaderLayout.superclass.clear.apply(this, arguments);
        },
        _setupListeners: function () {
            this._stateMonitor
                .add('album', this._onAlbumChange, this)
                .add('tag', this._onTagChange, this)
                .add('photo', this._onPhotoSelect, this)
                .add('photos', this._onPhotosChange, this);
            this._$element
                .on('click', '.close', jQuery.proxy(this._onLoaderSelect, this));
        },
        _clearListeners: function () {
            this._$element
                .off();
            this._stateMonitor
                .removeAll();
        },
        _loadData: function () {
            var client = this._client;

            return client.request('stat')
                .then(function (res) {
                    return vow.all([
                        client.request('albums'),
                        client.request('tags'),
                        client.request('photos')
                    ]);
                })
                .spread(function (albums, tags, photos) {
                    var data = this.getData().data;

                    data.set({
                        albums: albums,
                        tags: tags,
                        photos: photos
                    });
                }, this);
        },
        _onAlbumChange: function (url) {
            var state = this.getData().state;

            this._client.request('photos', [url])
                .then(function (photos) {
                    var data = this.getData().data;

                    data.set('photos', photos);
                }, this);
        },
        _onTagChange: function (url) {
            var state = this.getData().state;

            this._client.request('photos', [url])
                .then(function (photos) {
                    var data = this.getData().data;

                    data.set('photos', photos);
                }, this);
        },
        _onPhotosChange: function (url) {
            this._client.request('photos', [url])
                .then(function (photos) {
                    var data = this.getData().data,
                        prev = data.get('photos').entries;

                    photos.entries.unshift.apply(photos.entries, prev);

                    data.set('photos', photos);
                }, this);
        },
        _onPhotoSelect: function (photo) {
            var control = this.getData().control;

            control.events
                .fire('load', {
                    target: control,
                    image: jQuery.extend({}, photo, {
                        url: this._client.getPhotoUrl(photo.url),
                        type: 'image/jpeg'
                    })
                });
        },
        _onLoaderSelect: function (e) {
            e.preventDefault();

            var control = this.getData().control;

            control.events
                .fire('loaderchange', {
                    target: control,
                    loader: jQuery(e.target).data('loader')
                });
        }
    });

    ymaps.option.presetStorage
        .add('popup#fotkiImageLoader', {
            contentBodyLayout: FotkiImageLoaderLayout,
            albumSelectorLayout: AlbumSelectorLayout,
            tagSelectorLayout: TagSelectorLayout,
            photoListLayout: PhotoListLayout
        });

    provide(FotkiImageLoaderLayout);
});

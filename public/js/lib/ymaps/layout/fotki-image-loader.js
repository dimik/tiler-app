modules.define('ymaps-layout-fotki-image-loader', [
    'ymaps',
    'jquery',
    'vow',
    'yandex-fotki-client'
], function (provide, ymaps, jQuery, vow, YandexFotkiClient) {

    var FotkiImageLoaderLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well fotki-image-loader">',
            '<a class="close" href="#" data-loader="file">&times;</a>',
            '<div class="row-fluid">',
                '<form class="form-inline" style="padding-left: 15px;">',

                    '<span class="help-inline">Выберите&nbsp;</span>',

                    '{% include options.fotkiAlbumSelectorLayout %}',

                    '<span class="help-inline">&nbsp;или&nbsp;</span>',

                    '{% include options.fotkiTagSelectorLayout %}',

                '</form>',
            '</div>',
            '<div id="container" class="row-fluid" style="height:400px;overflow:scroll;">',

                '{% include options.fotkiPhotoListLayout %}',

            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            FotkiImageLoaderLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());
            this._stateMonitor = new ymaps.Monitor(this.getData().control.state);
            this._client = new YandexFotkiClient();
            this._loadData();
            this._attachHandlers();
        },
        clear: function () {
            this._detachHandlers();

            FotkiImageLoaderLayout.superclass.clear.apply(this, arguments);
        },
        _attachHandlers: function () {
            this._stateMonitor
                .add('album', this._onAlbumChange, this)
                .add('tag', this._onTagChange, this)
                .add('photos', this._onPhotosChange, this);
            this._$element
                // .on('click', '.thumbnail', jQuery.proxy(this._onImageSelect, this))
                .on('click', '.close', jQuery.proxy(this._onLoaderSelect, this));
        },
        _detachHandlers: function () {
            this._$element
                .off();
            this._stateMonitor
                .removeAll();
        },
        _loadData: function () {
            var client = this._client;

            client.request('stat')
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

                    this._clearScrollPosition();
                    data.set('photos', photos);
                }, this);
        },
        _onTagChange: function (url) {
            var state = this.getData().state;

            this._client.request('photos', [url])
                .then(function (photos) {
                    var data = this.getData().data;

                    this._clearScrollPosition();
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
        /*
        _onImageSelect: function (e) {
            e.preventDefault();

            var target = jQuery(e.currentTarget),
                control = this.getData().control,
                client = this._client,
                url = target.data('url');

            client.request('photo', [url])
                .then(function (res) {
                debugger;
                    control.events.fire('load', {
                        target: control,
                        image: {
                            url: target.data('url'),
                            name: target.attr('title'),
                            size: Math.ceil(target.data('size') / 1024),
                            type: 'image/jpeg'
                        }
                    });
                });
        },
        */
        _clearScrollPosition: function () {
            this.getData().control.state
                .set('scrollPosition', 0);
        },
        _onLoaderSelect: function (e) {
            e.preventDefault();

            this.getData().control.state
                .set('loader', jQuery(e.target).data('loader'));
        }
    });

    provide(FotkiImageLoaderLayout);
});

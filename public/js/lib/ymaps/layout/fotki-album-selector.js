modules.define('ymaps-layout-fotki-album-selector', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var FotkiAlbumSelectorLayout = ymaps.templateLayoutFactory.createClass([
        '<select name="album">',
            '<option{% if state.tag %} selected {% endif %}>альбом</option>',
            '{% for album in data.albums.entries %}',
                '<option data-url="{{ album.links.photos }}">{{ album.title }} ({{ album.imageCount }})</option>',
            '{% endfor %}',
        '</select>'
    ].join(''), {
        build: function () {
            FotkiAlbumSelectorLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            FotkiAlbumSelectorLayout.superclass.clear.apply(this, arguments);
        },
        _setupListeners: function () {
            this._$element
                .on('change', jQuery.proxy(this._onChange, this));
        },
        _clearListeners: function () {
            this._$element
                .off();
        },
        _onChange: function (e) {
            var url = jQuery(e.target).find(':selected').data('url');

            this.getData().control.state
                .set('album', url);
        }
    });

    provide(FotkiAlbumSelectorLayout);
});

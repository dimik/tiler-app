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
            this.constructor.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._attachHandlers();
        },
        clear: function () {
            this._detachHandlers();

            this.constructor.superclass.clear.apply(this, arguments);
        },
        _attachHandlers: function () {
            this._$element
                .on('change', jQuery.proxy(this._onChange, this));
        },
        _detachHandlers: function () {
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

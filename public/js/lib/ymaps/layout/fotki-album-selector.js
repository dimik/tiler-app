modules.define('ymaps-layout-fotki-album-selector', [
    'ymaps'
], function (provide, ymaps) {

    var FotkiAlbumSelectorLayout = ymaps.templateLayoutFactory.createClass([
        '<select name="album">',
            '<option>Выберите альбом</option>',
            '{% for album in data.albums.entries %}',
                '<option data-photos-url="{{ album.links.photos }}">{{ album.title }} ({{ album.imageCount }})</option>',
            '{% endfor %}',
        '</select>'
    ].join(''));

    provide(FotkiAlbumSelectorLayout);
});

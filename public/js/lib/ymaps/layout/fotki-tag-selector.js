modules.define('ymaps-layout-fotki-tag-selector', [
    'ymaps'
], function (provide, ymaps) {

    var FotkiTagSelectorLayout = ymaps.templateLayoutFactory.createClass([
        '<select name="tags">',
            '<option>Выберите тег</option>',
            '{% for tag in data.tags.entries %}',
                '<option data-photos-url="{{ tag.links.photos }}">{{ tag.title }} ({{ tag.imageCount }})</option>',
            '{% endfor %}',
        '</select>'
    ].join(''));

    provide(FotkiTagSelectorLayout);
});

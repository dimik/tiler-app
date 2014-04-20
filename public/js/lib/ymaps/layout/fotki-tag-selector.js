modules.define('ymaps-layout-fotki-tag-selector', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var FotkiTagSelectorLayout = ymaps.templateLayoutFactory.createClass([
        '<select name="tags">',
            '<option {% if state.album %} selected {% endif %}>тег</option>',
            '{% for tag in data.tags.entries %}',
                '<option data-url="{{ tag.links.photos }}">{{ tag.title }} ({{ tag.imageCount }})</option>',
            '{% endfor %}',
        '</select>'
    ].join(''), {
        build: function () {
            FotkiTagSelectorLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            FotkiTagSelectorLayout.superclass.clear.apply(this, arguments);
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
                .set('tag', url);
        }
    });

    provide(FotkiTagSelectorLayout);
});

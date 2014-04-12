modules.define('ymaps-layout-fotki-photo-list', [
    'ymaps',
    'jquery',
    'node-url'
], function (provide, ymaps, jQuery, url) {

    var FotkiPhotoListLayout = ymaps.templateLayoutFactory.createClass([
        '<div style="width:95%; margin:0 auto;">',
            '<ul class="thumbnails">',
                '{% for index, photo in data.photos.entries %}',
                    '{% if index > 0 && index % 4 == 0 %}',
                        '</ul>',
                        '<ul class="thumbnails">',
                    '{% endif %}',
                    '<li class="span3">',
                        '<a href="#" class="thumbnail" title="{{ photo.title }}"',
                            'data-url="{{ photo.img.orig.href }}"',
                            'data-size="{{ photo.img.orig.bytesize }}"',
                            'data-width="{{ photo.img.orig.width }}"',
                            'data-height="{{ photo.img.orig.height }}">',

                            '<img src="{{ photo.img.S.href }}" alt="{{ photo.title }}" style="width: auto; height: auto;">',
                        '</a>',
                    '</li>',
                '{% endfor %}',
            '</ul>',
            '{% if data.photos.links.next %}',
                '<div class="span4 offset4" style="padding-left: 35px;">',
                    '<a class="btn" data-url="{{ data.photos.links.next }}">Показать&nbsp;еще</a>',
                '</div>',
            '{% endif %}',
        '</div>'
    ].join(''), {
        build: function () {
           FotkiPhotoListLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());
            this._attachHandlers();
        },
        clear: function () {
            this._detachHandlers();

            this.constructor.superclass.clear.apply(this, arguments);
        },
       _attachHandlers: function () {
            this._$element
                .on('click', '.thumbnail', jQuery.proxy(this._onImageSelect, this))
                .on('click', '.btn', jQuery.proxy(this._onMoreImages, this));
        },
        _detachHandlers: function () {
            this._$element
                .off();
        },
        _onImageSelect: function (e) {
            e.preventDefault();

            var target = jQuery(e.currentTarget),
                control = this.getData().control;

            control.events.fire('load', {
                target: control,
                image: {
                    url: '/img/yandex/fotki' + url.parse(target.data('url')).path,
                    name: target.attr('title'),
                    size: target.data('size'),
                    type: 'image/jpeg'
                }
            });
        },
        _onMoreImages: function (e) {
            var target = jQuery(e.target);

            target.attr('disabled', 'disabled');

            this.getData().control.state
                .set({
                    photos: target.data('url'),
                    scrollPosition: target.closest('.row-fluid').scrollTop()
                });
        }
    });

    provide(FotkiPhotoListLayout);
});

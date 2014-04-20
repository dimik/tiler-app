modules.define('ymaps-layout-layer-publish', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var LayerPublishLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well well-white layer-publish">',
            '<div class="row-fluid">',
                '<p class="lead">Получение кода</p>',
                '<p>Вы можете скачать все изображения (тайлы) и разместить их на своем сервере, либо скопировать javascript-код на существующую страницу вашего сайта.</p>',
            '</div>',
            '<div class="row-fluid">',
                '<a href="{{ data.url }}">Скачать с Яндекс.Диска</a>',
            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            LayerPublishLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            LayerPublishLayout.superclass.build.apply(this, arguments);
        },
        _setupListeners: function () {
        },
        _clearListeners: function () {
        }
    });

    ymaps.option.presetStorage
        .add('popup#layerPublish', {
            contentBodyLayout: LayerPublishLayout
        });

    provide(LayerPublishLayout);
});

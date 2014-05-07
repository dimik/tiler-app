modules.define('ymaps-layout-layer-publish', [
    'ymaps',
    'jquery',
    'yandex-share'
], function (provide, ymaps, jQuery, Ya) {

    var LayerPublishLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well well-white layer-publish">',
            '<a href="#" class="close">&times;</a>',
            '<div class="row-fluid" style="padding-bottom: 20px;">',
                '<p class="lead">Изображение сохранено</p>',
                '<p>Вы можете скачать подготовленные файлы и&nbsp;разместить их на своем сайте.</p>',
                '<p><a target="_blank" class="download" href="{{ data.url }}">Скачать с Яндекс.Диска</a></p>',
            '</div>',
            '<div id="ya-share"></div>',
        '</div>'
    ].join(''), {
        build: function () {
            LayerPublishLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._createYaShare();

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            LayerPublishLayout.superclass.clear.apply(this, arguments);
        },
        _createYaShare: function (options) {
            return new Ya.share(jQuery.extend({ element: 'ya-share' }, options));
        },
        _setupListeners: function () {
            this._$element
                .on('click', '.close', jQuery.proxy(this._onCancel, this));
        },
        _clearListeners: function () {
            this._$element
                .off('click');
        },
        _onCancel: function (e) {
            e.preventDefault();

            var control = this.getData().control;

            control.events.fire('cancel', {
                target: control
            });
        }
    });

    ymaps.option.presetStorage
        .add('popup#layerPublish', {
            contentBodyLayout: LayerPublishLayout
        });

    provide(LayerPublishLayout);
});

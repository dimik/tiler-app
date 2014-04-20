modules.define('ymaps-layout-layer-setup', [
    'ymaps',
    'jquery',
    'ymaps-layout-image-status',
    'ymaps-layout-tile-type',
    'ymaps-layout-tile-color'
], function (provide, ymaps, jQuery, ImageStatusLayout, TileTypeLayout, TileColorLayout) {

    var LayerSetupLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well well-white layer-setup">',
            '<div class="row-fluid">',

                '{% include options.imageStatusLayout %}',

                '<div class="control-group">',
                    '<label class="control-label" for="tilerOutput">Название слоя</label>',
                    '<div class="controls">',
                        '<input type="text" name="tilerOutput" id="tilerOutput" value="{{ data.tilerOutput }}">',
                    '</div>',
                '</div>',
                '<div class="control-group">',
                    '<label class="control-label">Диапазон масштабов слоя</label>',
                    '<div class="controls">',
                        'от&nbsp;<input type="text" name="layerMinZoom" id="layerMinZoom" value="{{ data.layerMinZoom }}" class="span2 pull-left" />&nbsp;до&nbsp;',
                        '<input type="text" name="layerMaxZoom" id="layerMaxZoom" value="{{ data.layerMaxZoom }}" class="span2"/>',
                    '</div>',
                '</div>',
                /*
                '<div class="control-group">',
                    '<label class="checkbox">',
                        '<input type="checkbox" name="georeferenced" {% if data.georeferenced %}checked{% endif %}>Геопривязанный слой',
                    '</label>',
                '</div>',
                */

                '{% include options.tileTypeLayout %}',

                '{% include options.tileColorLayout %}',

                '<div class="form-actions" style="margin-bottom:0;">',
                    '<button type="submit" class="btn btn-primary">Далее</button>&nbsp;',
                    '<button type="reset" class="btn">Отменить</button>',
                '</div>',
            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            LayerSetupLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            LayerSetupLayout.superclass.clear.apply(this, arguments);
        },
        _setupListeners: function () {
            this._$element.find('input')
                .on('change', jQuery.proxy(this._onChange, this));

            this._$element.find(':submit')
                .on('click', jQuery.proxy(this._onSubmit, this));

            this._$element.find(':reset')
                .on('click', jQuery.proxy(this._onReset, this));
        },
        _clearListeners: function () {
            this._$element.find('input')
                .off('change');

            this._$element.find(':submit')
                .off('click');

            this._$element.find(':reset')
                .off('click');
        },
        _onSubmit: function (e) {
            e.preventDefault();

            var control = this.getData().control;

            control.events.fire('submit', {
                target: control
            });
        },
        _onReset: function (e) {
            e.preventDefault();

            var control = this.getData().control;

            control.events.fire('cancel', {
                target: control
            });
        },
        _onChange: function (e) {
            e.preventDefault();

            var control = this.getData().control,
                field = jQuery(e.target);

            control.events.fire('change', {
                target: control,
                name: field.attr('name'),
                value: field.val()
            });
        }
    });

    ymaps.option.presetStorage
        .add('sidebar#layerSetup', {
            contentBodyLayout: LayerSetupLayout,
            imageStatusLayout: ImageStatusLayout,
            tileTypeLayout: TileTypeLayout,
            tileColorLayout: TileColorLayout
        });

    provide(LayerSetupLayout);
});

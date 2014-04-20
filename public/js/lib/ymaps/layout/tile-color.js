modules.define('ymaps-layout-tile-color', [
    'ymaps',
    'jquery',
    'bootstrap-colorpicker'
], function (provide, ymaps, jQuery) {

    var TileColorLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="control-group">',
            '<label class="control-label" for="tileColor">Цвет фона тайла</label>',
            '<div class="controls">',
                '<div class="input-append">',
                    '<input class="input-medium" type="text" name="tileColor" id="tileColor" value="{{ data.tileColor }}" placeholder="#FFFFFF, black, rgba(0,0,0,0.0)">',
                    '<span class="add-on"><i></i></span>',
                '</div>',
            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            TileColorLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._monitor = new ymaps.Monitor(this.getData().data);
            this._initColorPicker();

            this._timeout = 100;
            this._timeoutId = null;

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            TileColorLayout.superclass.clear.apply(this, arguments);
        },
        _setupListeners: function () {
            this._$element
                .on('changeColor', jQuery.proxy(this._onChangeColor, this));
            this._monitor
                .add('tileType', this._onTileTypeChange, this);
        },
        _clearListeners: function () {
            this._monitor
                .removeAll();
            if(this._$element) {
                this._$element
                    .off('changeColor');
            }
        },
        _onChangeColor: function (e) {
            this._clearTimeout();
            this._timeoutId = window.setTimeout(jQuery.proxy(function () {
                this._triggerChange();
                this._clearTimeout();
            }, this), this._timeout);
        },
        _triggerChange: function () {
            this._$element.find('input')
                .trigger(jQuery.Event('change'));
        },
        _clearTimeout: function () {
            if(this._timeoutId) {
                window.clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }
        },
        _initColorPicker: function () {
            var tileType = this.getData().data.get('tileType'),
                input = this._$element.find('input');

            if(tileType === 'image/jpeg') {
                input.colorpicker({ format: 'rgb' });
            }
            else {
                input.colorpicker({ format: 'rgba', alpha: 1 });
                // input.colorpicker('setAlpha', 1);
            }
        },
        _destroyColorPicker: function () {
            this._$element.find('input').colorpicker('destroy');
        },
        _onTileTypeChange: function () {
            this._destroyColorPicker();
            this._initColorPicker();
            this._triggerChange();
        }
    });

    provide(TileColorLayout);
});

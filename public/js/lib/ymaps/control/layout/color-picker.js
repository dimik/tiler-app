define(['ready!ymaps', 'jquery'], function (ymaps, jQuery) {

return ymaps.templateLayoutFactory.createClass([
    '<div class="control-group">',
        '<label class="control-label" for="tileBackground">Цвет фона тайла</label>',
        '<div class="controls">',
            '<div class="input-append">',
                '<input class="input-medium" type="text" name="tileBackground" id="tileBackground" value="{{ data.tileBackground }}" placeholder="#FFFFFF, black, rgba(0,0,0,0.0)">',
                '<span class="add-on"><i></i></span>',
            '</div>',
        '</div>',
    '</div>'
].join(''), {
    build: function () {
        this.constructor.superclass.build.apply(this, arguments);

        this._$element = jQuery(this.getElement());

        this._monitor = new ymaps.Monitor(this.getData().data);
        this._initColorPicker();

        this._timeout = 100;
        this._timeoutId = null;

        this._attachHandlers();
    },
    clear: function () {
        this._detachHandlers();

        this.constructor.superclass.clear.apply(this, arguments);
    },
    _attachHandlers: function () {
        this._$element
            .on('changeColor', jQuery.proxy(this._onChangeColor, this));
        this._monitor
            .add('tileType', this._onTileTypeChange, this);
    },
    _detachHandlers: function () {
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

});

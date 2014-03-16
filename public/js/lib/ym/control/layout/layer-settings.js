define(['ready!ymaps', 'jquery', 'module'], function (ymaps, jQuery, module) {

var config = module.config();

return ymaps.templateLayoutFactory.createClass([
    '<div class="well layer-settings">',
//        '<form>',
        '<div class="row-fluid">',

            '{% include options.imageStatusLayout %}',

            '<div class="control-group">',
                '<label class="control-label" for="layerName">Название слоя</label>',
                '<div class="controls">',
                    '<input type="text" name="layerName" id="layerName" value="{{ data.layerName }}">',
                '</div>',
            '</div>',
            '<div class="control-group">',
                '<label class="control-label" for="maxZoom">Диапазон масштабов слоя</label>',
                '<div class="controls">',
                    'от&nbsp;<input type="text" name="minZoom" id="minZoom" value="{{ data.minZoom }}" class="span2 pull-left" />&nbsp;до&nbsp;',
                    '<input type="text" name="maxZoom" id="maxZoom" value="{{ data.maxZoom }}" class="span2"/>',
                '</div>',
            '</div>',
            '<div class="control-group">',
                '<label class="checkbox">',
                    '<input type="checkbox" name="georeferenced" {% if data.georeferenced %}checked{% endif %}>Геопривязанный слой',
                '</label>',
            '</div>',
            '<div class="control-group">',
                '<label class="control-label">Формат тайлов</label>',
                '<div class="controls">',
                    '<label class="radio inline">',
                        '<input type="radio" name="tileType" value="image/png" {% if data.tileType == "image/png" %}checked{% endif %}>png',
                    '</label>',
                    '<label class="radio inline">',
                        '<input type="radio" name="tileType" value="image/jpeg" {% if data.tileType == "image/jpeg" %}checked{% endif %}>jpeg',
                    '</label>',
                    '<label class="radio inline">',
                        '<input type="radio" name="tileType" value="image/gif" {% if data.tileType == "image/gif" %}checked{% endif %}>gif',
                    '</label>',
                '</div>',
            '</div>',
            '<div class="control-group">',
                '<label class="control-label" for="tileOpacity">Непрозрачность тайла</label>',
                '<div class="controls">',
                    '<div class="input-append">',
                        '<input class="span3" type="text" name="tileOpacity" id="tileOpacity" value="{{ data.tileOpacity }}" placeholder="100">',
                        '<span class="add-on">%</span>',
                    '</div>',
                '</div>',
            '</div>',
            '<div class="control-group">',
                '<label class="control-label" for="tileBackground">Цвет фона тайла</label>',
                '<div class="controls">',
                    '<input type="text" name="tileBackground" id="tileBackground" value="{{ data.tileBackground }}" placeholder="#FFFFFF, black, rgba(0,0,0,0.0)">',
                '</div>',
            '</div>',
            '<div class="form-actions">',
                '<button type="submit" class="btn btn-primary"{% if state.submitted %} disabled{% endif %}>Далее</button>&nbsp;',
                '<button type="reset" class="btn{% if state.submitted %} btn-danger{% endif %}">Отменить</button>',
            '</div>',
        '</div>',
//        '</form>',
    '</div>'
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
        this._$element.find('input')
            .on('change', jQuery.proxy(this._onChange, this));

        this._$element.find(':submit')
            .on('click', jQuery.proxy(this._onSubmit, this));

        this._$element.find(':reset')
            .on('click', jQuery.proxy(this._onReset, this));
    },
    _detachHandlers: function () {
        if(this._$element) {
            this._$element.find('input')
                .off('change');

            this._$element.find(':submit')
                .off('click');

            this._$element.find(':reset')
                .off('click');
        }
    },
    _onSubmit: function (e) {
        e.preventDefault();

        var control = this.getData().control,
            fields = this._$element.find('input').serializeArray();

        control.state.set('submitted', true);
        control.events.fire('submit', {
            target: control,
            settings: this._getSettings()
        });
    },
    _onReset: function (e) {
        e.preventDefault();

        var control = this.getData().control;

        control.state.set('submitted', false);
        control.events.fire('cancel', {
            target: control
        });
    },
    _onChange: function (e) {
        e.preventDefault();

        var control = this.getData().control;

        control.events.fire('change', {
            target: control,
            settings: this._getSettings()
        });
    },
    _getSettings: function () {
        return this._$element.find('input').serializeArray()
            .reduce(function (data, field, index) {
                data[field.name] = field.value;
                return data;
            }, {});
    }
});

});

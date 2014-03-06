define(['ready!ymaps', 'jquery', 'module'], function (ymaps, jQuery, module) {

var config = module.config();

return ymaps.templateLayoutFactory.createClass([
    '<div class="well layer-settings">',
        '<form>',
        '<div class="row-fluid">',
            '<div class="media image-status">',
                '<img width="64" height="64" class="media-object pull-left img-polaroid" data-src="holder.js/64x64" src="{{ data.source.src }}">',
                '<div class="media-body">',
                    '<h4 class="media-heading">{{ data.source.name|raw }}</h4>',
                    '<small><span class="label label-success">{{ data.source.type }}</span></small><br/>',
                    '<small>{{ data.source.width}}x{{ data.source.height }} пикс</small><br/>',
                    '<small>{{ data.source.size|raw }}</small>',
                '</div>',
            '</div>',
            '<div class="control-group">',
                '<label class="control-label" for="output">Название слоя</label>',
                '<div class="controls">',
                    '<input type="text" name="output" id="output" value="{{ data.settings.output }}">',
                '</div>',
            '</div>',
            '<div class="control-group">',
                '<label class="control-label" for="maxZoom">Диапазон масштабов слоя</label>',
                '<div class="controls">',
                    'от&nbsp;<input type="text" name="minZoom" id="minZoom" value="{{ data.settings.minZoom }}" class="span2 pull-left" />&nbsp;до&nbsp;',
                    '<input type="text" name="maxZoom" id="maxZoom" value="{{ data.settings.maxZoom }}" class="span2"/>',
                '</div>',
            '</div>',
            '<div class="control-group">',
                '<label class="checkbox">',
                    '<input type="checkbox" name="georeferenced" {% if data.settings.georeferenced %}checked{% endif %}>Геопривязанный слой',
                '</label>',
            '</div>',
            '<div class="control-group">',
                '<label class="control-label">Формат тайлов</label>',
                '<div class="controls">',
                    '<label class="radio inline">',
                        '<input type="radio" name="tileType" value="image/png" {% if data.settings.tileType == "image/png" %}checked{% endif %}>png',
                    '</label>',
                    '<label class="radio inline">',
                        '<input type="radio" name="tileType" value="image/jpeg" {% if data.settings.tileType == "image/jpeg" %}checked{% endif %}>jpeg',
                    '</label>',
                    '<label class="radio inline">',
                        '<input type="radio" name="tileType" value="image/gif" {% if data.settings.tileType == "image/gif" %}checked{% endif %}>gif',
                    '</label>',
                '</div>',
            '</div>',
            '<div class="form-actions">',
                '<button type="submit" class="btn btn-primary"{% if state.submitted %} disabled{% endif %}>Далее</button>&nbsp;',
                '<button type="reset" class="btn{% if state.submitted %} btn-danger{% endif %}">Отменить</button>',
            '</div>',
        '</div>',
        '</form>',
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
            settings: fields.reduce(function (data, field, index) {
                data[field.name] = field.value;
                return data;
            }, {})
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
            name: e.target.name,
            value: e.target.value
        });
    }
});

});

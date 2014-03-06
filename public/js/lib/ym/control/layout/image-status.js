define(['ready!ymaps', 'jquery'], function (ymaps, jQuery) {

return ymaps.templateLayoutFactory.createClass([
    '<div class="well image-status">',
        '<a class="close" href="#">&times;</a>',
        '<div class="thumbnail">',
            '<img src="{{ data.src }}" width="160" height="120"/>',
            '<div class="caption">',
                //'<h3>{{ data.name }}</h3>',
                '<p>тип: {{ data.type }}</p>',
                '<p>ширина: {{ data.width }}</p>',
                '<p>высота: {{ data.height }}</p>',
                '<p>размер: {{ data.size }}</p>',
            '</div>',
        '</div>',
        '<div class="form-actions slim">',
            '<button class="btn btn-primary" type="submit">Далее</button>&nbsp;',
            '<button class="btn" type="reset">Отменить</button>',
        '</div>',
    '</div>'
].join(''), {
    build: function () {
        this.constructor.superclass.build.apply(this, arguments);

        this._$element = jQuery(this.getElement());

        this._attachHandlers();
    },
    clear: function () {
        this._detachHandlers();

        this.constructor.superclass.build.apply(this, arguments);
    },
    _attachHandlers: function () {
        this._$element
            .on('click', ':submit', jQuery.proxy(this._onSubmit, this))
            .on('click', ':reset,.close', jQuery.proxy(this._onCancel, this));
    },
    _detachHandlers: function () {
        if(this._$element) {
            this._$element
                .off('click', ':submit')
                .off('click', ':reset,.close');
        }
    },
    _onSubmit: function (e) {
        e.preventDefault();

        var control = this.getData().control;

        control.events.fire('submit', {
            type: 'submit',
            target: control
        });
    },
    _onCancel: function (e) {
        e.preventDefault();

        var control = this.getData().control;

        control.events.fire('cancel', {
            type: 'cancel',
            target: control
        });
    }
});

});

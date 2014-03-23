modules.define('ymaps-layout-popup', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    provide(
        ymaps.templateLayoutFactory.createClass([
            '<div class="alert alert-block alert-{{ options.priority|default:"error" }}">',
                '<a href="#" class="close">&times;</a>',
                '<p>{{ data.content|raw }}</p>',
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
                    .on('click', '.close', jQuery.proxy(this._onCancel, this));
            },
            _detachHandlers: function () {
                this._$element
                    .off('click', '.close');
            },
            _onCancel: function (e) {
                e.preventDefault();

                var control = this.getData().control;

                control.events.fire('cancel', {
                    target: control,
                });
            }
        })
    );
});

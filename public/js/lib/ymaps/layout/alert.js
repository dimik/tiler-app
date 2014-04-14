modules.define('ymaps-layout-alert', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var AlertLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="alert alert-block alert-{{ options.priority|default:"error" }}">',
            '<a href="#" class="close">&times;</a>',
            '<p>{{ data.content|raw }}</p>',
        '</div>'
    ].join(''), {
        build: function () {
            AlertLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            AlertLayout.superclass.build.apply(this, arguments);
        },
        _setupListeners: function () {
            this._$element
                .on('click', '.close', jQuery.proxy(this._onCancel, this));
        },
        _clearListeners: function () {
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
    });

    provide(AlertLayout);
});

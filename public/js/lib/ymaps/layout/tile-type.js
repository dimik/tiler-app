modules.define('ymaps-layout-tile-type', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var TileTypeLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="control-group">',
            '<label class="control-label">Формат тайлов</label>',
            '<div class="controls">',
                '{% for mime in data.acceptedMimes %}',
                    '<label class="radio inline">',
                        '<input type="radio" name="tileType" value="image/{{ mime }}">{{ mime }}',
                    '</label>',
                '{% endfor %}',
            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            TileTypeLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());
            this._setTileType(this.getData().data.get('tileType'));

            this._setupListeners();
        },
        clear: function () {
            this._clearListeners();

            TileTypeLayout.superclass.clear.apply(this, arguments);
        },
        _setupListeners: function () {
            this._$element
                .on('change', jQuery.proxy(this._onChange, this));
        },
        _clearListeners: function () {
            if(this._$element) {
                this._$element
                    .off('change');
            }
        },
        _onChange: function (e) {
            this.getData().data.set('tileType', jQuery(e.target).val());
        },
        _setTileType: function (type) {
            this._$element.find('[value="' + type + '"]').get(0).checked = true;
        }
    });

    provide(TileTypeLayout);
});

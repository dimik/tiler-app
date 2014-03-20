define(['ready!ymaps', 'jquery'], function (ymaps, jQuery) {

return ymaps.templateLayoutFactory.createClass([
    '<div class="control-group">',
        '<label class="control-label">Формат тайлов</label>',
        '<div class="controls">',
            '<label class="radio inline">',
                '<input type="radio" name="tileType" value="image/png">png',
            '</label>',
            '<label class="radio inline">',
                '<input type="radio" name="tileType" value="image/jpeg">jpeg',
            '</label>',
            '<label class="radio inline">',
                '<input type="radio" name="tileType" value="image/gif">gif',
            '</label>',
        '</div>',
    '</div>'
].join(''), {
    build: function () {
        this.constructor.superclass.build.apply(this, arguments);

        this._$element = jQuery(this.getElement());
        this._setTileType(this.getData().data.get('tileType'));

        this._attachHandlers();
    },
    clear: function () {
        this._detachHandlers();

        this.constructor.superclass.clear.apply(this, arguments);
    },
    _attachHandlers: function () {
        this._$element
            .on('change', jQuery.proxy(this._onChange, this));
    },
    _detachHandlers: function () {
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

});

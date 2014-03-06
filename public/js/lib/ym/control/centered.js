define([
    'ready!ymaps',
    './base'
], function (ymaps, BaseControl) {

var ContentLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="container-fluid" style="left:{{ options.position.left }}px;top:{{ options.position.top }}px;">',
            '{% include options.contentBodyLayout %}',
        '</div>'
    ].join(''));

function CenteredControl() {
    BaseControl.apply(this, arguments);

    this.options.set('contentLayout', ContentLayout);
}

ymaps.util.augment(CenteredControl, BaseControl, {
    _init: function (el) {
        this.constructor.superclass._init.apply(this, arguments);

        this._setPosition();
        this._attachHandlers();
    },
    _destroy: function () {
        this._detachHandlers();

        this.constructor.superclass._destroy.apply(this, arguments);
    },
    /**
     * Устанавливает контролу опцию "position".
     * @function
     * @private
     * @name CenteredControl._setPosition
     * @param {Array} size Размер контейнера карты.
     */
    _setPosition: function () {
        var size = this._map.container.getSize();

        this.options.set('position', {
            top: size[1] / 2 - this._element.offsetHeight / 2,
            left: size[0] / 2 - this._element.offsetWidth / 2
        });
    },
    _attachHandlers: function () {
        this._map.container.events
            .add('sizechange', this._setPosition, this);

        //this.data.events.add('change', this._setPosition, this);

    },
    _detachHandlers: function () {
        if(this._map) {
            this._map.container.events
                .remove('sizechange', this._setPosition, this);

            //this.data.events.remove('change', this._setPosition, this);
        }
    }
});

return CenteredControl;

});

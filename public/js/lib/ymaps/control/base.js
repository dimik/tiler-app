define(['ready!ymaps', 'module'], function (ymaps, module) {

/**
 * @class
 * @name BaseControl
 */
function BaseControl(parameters) {
    parameters = parameters || {};
    parameters.data = parameters.data || {};
    parameters.state = parameters.state || {};
    parameters.options = parameters.options || {};

    this.data = new ymaps.data.Manager(parameters.data);
    this.state = new ymaps.data.Manager(parameters.state);
    this.options = new ymaps.option.Manager(parameters.options);
    this.events = new ymaps.event.Manager();

    /**
     * Передаем в макет контрола данные о его опциях.
     * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/ILayout.xml#constructor-summary
     */
    this._layout = this._createLayout({ control: this, data: this.data, state: this.state, options: this.options });
    this._map = null;
    this._element = null;
}

/**
 * @lends BaseControl.prototype
 */
BaseControl.prototype = {
    /**
     * @constructor
     */
    constructor: BaseControl,
    /**
     * Устанавливает родительский объект.
     * @function
     * @name BaseControl.setParent
     * @param {IControlParent} parent Родительский объект.
     * @returns {BaseControl} Возвращает ссылку на себя.
     */
    setParent: function (parent) {
        this._destroy();
        this._parent = parent;

        if(parent) {
            parent.getChildElement(this)
                .done(this._init, this);
        }
        else {
            this._layout.setParentElement(null);
        }

        return this;
    },
    /**
     * Возвращает ссылку на родительский объект.
     * @see http://api.yandex.ru/maps/doc/jsapi/2.x/ref/reference/IControl.xml#getParent
     * @function
     * @name BaseControl.getParent
     * @returns {IControlParent} Ссылка на родительский объект.
     */
    getParent: function () {
        return this._parent;
    },
    _init: function (el) {
        this._map = this._parent.getMap();
        this._layout.setParentElement(
            this._element = el
        );
    },
    _destroy: function () {
        this._map = this._element = null;
    },
    _createLayout: function (data) {
        var ControlLayout = ymaps.templateLayoutFactory.createClass([
                '<ymaps{% if options.visible == false %} style="display:none;"{% endif %}>',
                    '{% include options.contentLayout %}',
                '</ymaps>'
            ].join(''));

        return new ControlLayout(data);
    }
};

return BaseControl;

});

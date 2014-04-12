modules.define('ymaps-control-centered', [
    'inherit',
    'ymaps',
    'ymaps-control-base'
], function (provide, inherit, ymaps, BaseControl) {

    var ContentLayout = ymaps.templateLayoutFactory.createClass([
            '<div class="container-fluid">',
                '{% include options.contentBodyLayout %}',
            '</div>'
        ].join(''), {
            build: function () {
                ContentLayout.superclass.build.call(this);
                this._setupListeners();
                this._setPosition();
            },

            clear: function () {
                this._clearListeners();
                ContentLayout.superclass.clear.call(this);
            },

            _setupListeners: function () {
                var layoutData = this.getData(),
                    control = layoutData.control;
                this._mapListener = control.getMap().events.group()
                    .add('sizechange', this._setPosition, this);
            },

            _clearListeners: function () {
                this._mapListener.removeAll();
            },

            _setPosition: function () {
                var control = this.getData().control,
                    mapSize = control.getMap().container.getSize(),
                    layoutContentElement = this.getElement().firstChild;

                control.options.set('position', {
                    top: Math.round(mapSize[1] / 2 - layoutContentElement.offsetHeight / 2),
                    left: Math.round(mapSize[0] / 2 - layoutContentElement.offsetWidth / 2)
                });
            }
        });

    var CenteredControl = inherit(BaseControl, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this.options.set({
                contentLayout: ContentLayout,
                float: 'none'
            });
        }
    });

    provide(CenteredControl);
});

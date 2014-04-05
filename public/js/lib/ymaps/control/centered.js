modules.define('ymaps-control-centered', [
    'inherit',
    'ymaps',
    'ymaps-control-base'
], function (provide, inherit, ymaps, BaseControl) {

    var ContentLayout = ymaps.templateLayoutFactory.createClass([
            '<div class="container-fluid" ',
                '{% include options.contentBodyParentLayout %}',
            '</div>'
        ].join(''), {
            init: function () {
                ContentLayout.superclass.init.call(this);
                var layoutData = this.getData();
                this.sharedEvents = new ymaps.event.Manager(); 
                
                this.setData(ymaps.util.extend({}, layoutData, {
                    sharedEvents: this.sharedEvents 
                }));
            },

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

                this._subLayoutListener = this.sharedEvents.group()
                    .add('sublayoutsizechange', this._setPosition, this);
            },

            _clearListeners: function () {
                this._mapListener.removeAll();
                this._subLayoutListener.removeAll();
            },

            _setPosition: function () {
                var control = this.getData().control,
                    mapSize = control.getMap().container.getSize(),
                    layoutContentElement = this.getElement().firstChild;

                control.options.set('position', {
                    top: mapSize[1] / 2 - layoutContentElement.offsetHeight / 2,
                    left: mapSize[0] / 2 - layoutContentElement.offsetWidth / 2
                });
            }
        }),
        ContentBodyParentLayout = ymaps.templateLayoutFactory.createClass('{% include options.contentBodyLayout observeSize %}', {
            onSublayoutSizeChange: function (sublayoutInfo, nodeSizeByContent) {
                this.getData().sharedEvents.fire('sublayoutsizechange');
            }
        });

    var CenteredControl = inherit(BaseControl, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this.options.set({
                contentLayout: ContentLayout,
                contentBodyParentLayout: ContentBodyParentLayout,
                float: 'none'
            });
        }
    });

    provide(CenteredControl);
});
modules.define('map-view-preloader', [
    'inherit',
    'jquery',
    'ymaps',
    'ymaps-map',
    'ymaps-control-centered',
    'ymaps-layout-preloader'
], function (provide, inherit, jQuery, ymaps, map, CenteredControl, PreloaderLayout) {

    provide(
        inherit({
            __constructor: function () {
                this.events = jQuery({});
                this._control = this._createControl();
            },
            render: function (data) {
                if(!this._control.getParent()) {
                    map.controls.add(this._control);
                }

                if(data) {
                    this._control.data.set(data);
                }

                return this;
            },
            clear: function () {
                map.controls.remove(this._control);

                return this;
            },
            show: function () {
                this._control.options.set('visible', true);

                return this;
            },
            hide: function () {
                this._control.options.set('visible', false);

                return this;
            },
            _createControl: function (data, options) {
                return new CenteredControl({
                    data: data,
                    options: {
                        float: 'none',
                        contentBodyLayout: PreloaderLayout
                    }
                });
            }
        })
    );
});

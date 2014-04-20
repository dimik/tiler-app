modules.define('app', [
    'inherit',
    'map-view-popup',
    'map-view-sidebar',
    'map-view-tile-source-layer',
    'layer-tiler',
    'app-state-factory',
    'app-config'
], function (provide, inherit, PopupMapView, SidebarMapView, TileSourceLayerMapView, LayerTiler, AppStateFactory, config) {

    var App = inherit({
        __constructor: function () {
            this.options = config;
            this.popup = new PopupMapView();
            this.sidebar = new SidebarMapView();
            this.tiler = new LayerTiler();
            this._tileSourceLayer = new TileSourceLayerMapView();
            this._stateFactory = new AppStateFactory(this);

            this.setState('login');
        },
        setState: function (state) {
            this._state = this._stateFactory.create(state);
        },
        getTileSource: function () {
            return this.tiler.getTileSource();
        },
        addSourceLayer: function () {
            this._tileSourceLayer.render(
                this.getTileSource()
            );

            return this;
        },
        removeSourceLayer: function () {
            this._tileSourceLayer.clear();

            return this;
        },
        publishLayer: function () {
            return this.tiler.publish();
        }
    });

    provide(App);
});

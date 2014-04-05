modules.define('app', [
    'inherit',
    'map-view-popup',
    'map-view-preloader',
    'map-view-image-reader',
    'map-view-layer-settings',
    'map-view-tile-source-layer',
    'layer-tiler',
    'app-state-factory',
    'app-config'
], function (provide, inherit, PopupMapView, PreloaderMapView, ImageReaderMapView, LayerSettingsMapView, TileSourceLayerMapView, LayerTiler, AppStateFactory, config) {

    var App = inherit({
        __constructor: function () {
            this.options = config;
            this.popup = new PopupMapView();
            this.preloader = new PreloaderMapView();
            this.reader = new ImageReaderMapView();
            this.sidebar = new LayerSettingsMapView();
            this.tiler = new LayerTiler();
            this._tileSourceLayer = new TileSourceLayerMapView();
            this._stateFactory = new AppStateFactory(this);

            this.setState('user-auth');
            this._attachHandlers();
        },
        setState: function (state) {
            this._state = this._stateFactory.create(state);
        },
        getTileSource: function () {
            return this.tiler.getTileSource();
        },
        renderSourceLayer: function () {
            this._tileSourceLayer.render(
                this.getTileSource()
            );

            return this;
        }
    });

    provide(App);
});

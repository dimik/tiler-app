modules.define('app', [
    'inherit',
    'ymaps',
    'map-view-popup',
    'map-view-preloader',
    'map-view-image-reader',
    'map-view-layer-settings',
    'map-view-tile-source-layer',
    'layer-tiler',
    'tile-source',
    'app-state-factory'
], function (provide, inherit, ymaps, PopupMapView, PreloaderMapView, ImageReaderMapView, LayerSettingsMapView, TileSourceLayerMapView, LayerTiler, TileSource, AppStateFactory) {

    var App = inherit({
        __constructor: function () {
            this._data = new ymaps.data.Manager(this.getDefaults());

            this.popup = new PopupMapView();
            this.preloader = new PreloaderMapView();
            this.reader = new ImageReaderMapView();
            this.sidebar = new LayerSettingsMapView();
            this._tileSourceLayer = new TileSourceLayerMapView();
            this.tiler = new LayerTiler();
            this._tileSource = this._createTileSource();
            this._stateFactory = new AppStateFactory(this);

            this.setState('user-auth');
            this._attachHandlers();
        },
        setState: function (state) {
            this._state = this._stateFactory.create(state);
        },
        getData: function () {
            return this._data.getAll();
        },
        setData: function (data) {
            this._data.set(data);

            return this;
        },
        getTileSource: function () {
            return this._tileSource;
        },
        renderSourceLayer: function () {
            this._tileSourceLayer.render(
                this.getTileSource(),
                this.getData()
            );

            return this;
        },
        _createTileSource: function () {
            return new TileSource(this.getData());
        },
        _attachHandlers: function () {
            this._data.events
                .add('change', this._onDataChange, this);
        },
        _detachHandlers: function () {
            this._data.events
                .remove('change', this._onDataChange, this);
        },
        _onDataChange: function () {
            this._tileSource.setOptions(this.getData());
        },
        getDefaults: function () {
            return {
                layerName: 'tiles-' + Date.now(),
                minZoom: 0,
                tileSize: 256,
                tileBackground: 'rgba(0,0,0,0.0)',
                tileType: 'image/png',
                tileOpacity: 1.0
            };
        }
    });

    provide(App);
});

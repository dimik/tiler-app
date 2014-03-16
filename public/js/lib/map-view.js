define(['ready!ymaps', 'jquery', 'module'], function (ymaps, $, module) {

var config = module.config();

function MapView() {
    this._map = this._createMap();
    this.events = new ymaps.event.Manager();
};

MapView.prototype = {
    constructor: MapView,
    render: function (source, options) {
        this._attachHandlers();

        var map = this._map;

/*
        var Layer = this._createLayer(source, options);

        this._map.layers.add(new Layer());
*/

        this._layer = this._createLayer(source, options);
        ymaps.layer.storage.add(options.layerName, this._layer);

        this._mapType = this._createMapType(options);
        ymaps.mapType.storage.add(options.layerName, this._mapType);

    this._typeSelector = this._createTypeSelector();
    this._map.controls.add(this._typeSelector);

        //map.controls.get('typeSelector')
        this._typeSelector
            // .addMapType(options.layerName, 0);
            .addMapType(this._mapType, 0);

        map.setType(options.layerName);
        map.setZoom(options.maxZoom);

        // map.options.set('projection', new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false]));

        return this;
    },
    clear: function () {
        this._detachHandlers();
        this._map.destroy();

        return this;
    },
    _createMap: function () {
        return new ymaps.Map(
            config.container,
            config.state,
            config.options
        );
    },
    _createTypeSelector: function () {
        return new ymaps.control.TypeSelector([
            'yandex#map',
            'yandex#satellite',
            'yandex#hybrid'
        ]);
    },
    _createLayer: function (tileSource, options) {
        var map = this._map,
            zoomRange = [options.minZoom, options.maxZoom],
            tileType = options.tileType;

        return function () {
            var layer = new ymaps.Layer('');

            layer.getTileUrl = function (tileNumber, tileZoom) {
                tileNumber = this.restrict(tileNumber, tileZoom);

                if(tileNumber) {
                    var tile = tileSource.getTile(tileNumber[0], tileNumber[1], tileZoom);

                    if(tile) {
                        return tile.toDataURL(tileType);
                    }
                }

                return null;
            };

            layer.getZoomRange = function () {
                var defer = new ymaps.vow.Deferred();

                defer.resolve(zoomRange);

                return defer.promise();
            };

            tileSource.events
                .on('optionschange', function (e) {
                    var options = tileSource.getOptions();

                    zoomRange[0] = options.minZoom;
                    zoomRange[1] = options.maxZoom;
                    tileType = options.tileType;
                    map.setZoom(options.maxZoom);

                    layer.events.fire('zoomrangechange');

                    layer.update();
                });

            return layer;
        };
    },
    _createMapType: function (options) {
        var layers = options.backgroundMapType?
                ymaps.mapType.storage.get(options.backgroundMapType).getLayers() : [];

        return new ymaps.MapType(options.layerName, layers.concat([options.layerName]));
    },
    _attachHandlers: function () {
        this._map.events
            .add('click', this._onMapClick, this);
    },
    _detachHandlers: function () {
        this._map.events
            .remove('click', this._onMapClick, this);
    },
    _onMapClick: function (e) {
        this.events.fire('click', e);
    },
    addLayer: function (layer) {
        map
    },
    getMap: function () {
        return this._map;
    },
    setBounds: function (bounds) {
        this._map.setBounds(bounds);

        return this;
    }
};

return MapView;

});

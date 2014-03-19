define(['ready!ymaps', 'module'], function (ymaps, module) {

function TileSourceLayerMapView(map) {
    this._map = map;
    this._layer = null;
};

TileSourceLayerMapView.prototype = {
    constructor: TileSourceLayerMapView,
    render: function (tileSource, options) {
        this._layer = this._createLayer(tileSource, options);
        ymaps.layer.storage.add(options.layerName, this._layer);

        this._mapType = this._createMapType(options);
        ymaps.mapType.storage.add(options.layerName, this._mapType);

        this._map.options.set('projection', new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false]));
        this._map.setType(options.layerName);
        this._map.setCenter([0, 0], options.maxZoom);

        return this;
    },
    clear: function () {
        this._map.setType('yandex#map');

        return this;
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
    }
};

return TileSourceLayerMapView;

});

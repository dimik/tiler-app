modules.define('map-view-tile-source-layer', [
    'inherit',
    'ymaps',
    'ymaps-map',
    'app-config'
], function (provide, inherit, ymaps, map, config) {

    var layerName = 'user#map';

    var TileSourceLayerMapView = inherit({
        __constructor: function () {
            this._layer = null;
            this._mapState = this._getMapState();
        },
        render: function (tileSource) {
            this._layer = this._createLayer(tileSource);
            ymaps.layer.storage.add(layerName, this._layer);

            this._mapType = this._createMapType();
            ymaps.mapType.storage.add(layerName, this._mapType);

            map.options.set('projection', this._createProjection());
            map.setType(layerName);
            map.setCenter([0, 0], tileSource.getMaxZoom());

            return this;
        },
        clear: function () {
            var state = this._mapState;

            map.options.set('projection', state.projection);
            map.setType(state.type);
            map.setCenter(state.center, state.zoom);

            ymaps.layer.storage.remove(layerName);
            ymaps.mapType.storage.remove(layerName);

            return this;
        },
        _getMapState: function () {
            return {
                center: map.getCenter(),
                zoom: map.getZoom(),
                type: map.getType(),
                projection: map.options.get('projection')
            };
        },
        _createProjection: function () {
            return new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false]);
        },
        _createLayer: function (tileSource) {
            var zoomRange = [tileSource.getMinZoom(), tileSource.getMaxZoom()],
                monitor = new ymaps.Monitor(config),
                layer = new ymaps.Layer(''),
                update = function () {
                    layer.events.fire('zoomrangechange');
                    layer.update();
                };

            monitor
                .add('layerMinZoom', function (minZoom) {
                    zoomRange[0] = tileSource.setMinZoom(minZoom).getMinZoom();
                    update();
                })
                .add('layerMaxZoom', function (maxZoom, oldMaxZoom) {
                    zoomRange[1] = tileSource.setMaxZoom(maxZoom).getMaxZoom();
                    update();

                    if(oldMaxZoom > maxZoom && map.getZoom() > maxZoom) {
                        map.setZoom(maxZoom);
                    }
                })
                .add(['tileType', 'tileColor'], function () {
                    layer.update();
                });

            layer.getTileUrl = function (tileNumber, tileZoom) {
                tileNumber = this.restrict(tileNumber, tileZoom);

                if(tileNumber) {
                    var tile = tileSource.renderTile(tileNumber[0], tileNumber[1], tileZoom);

                    if(tile) {
                        return tile.toDataURL();
                    }
                }

                return null;
            };

            layer.getZoomRange = function () {
                return ymaps.vow.resolve(zoomRange);
            };

            return function () {
                return layer;
            };
        },
        _createMapType: function () {
            var layers = /*options.backgroundMapType?
                    ymaps.mapType.storage.get(options.backgroundMapType).getLayers() : */[];

            return new ymaps.MapType(layerName, layers.concat([layerName]));
        }
    });

    provide(TileSourceLayerMapView);
});

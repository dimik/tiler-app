modules.define('map-view-tile-source-layer', [
    'inherit',
    'ymaps',
    'ymaps-map',
    'app-config'
], function (provide, inherit, ymaps, map, config) {

    var TileSourceLayerMapView = inherit({
        __constructor: function () {
            this._layer = null;
        },
        render: function (tileSource) {
            this._layer = this._createLayer(tileSource);
            ymaps.layer.storage.add(config.get('tilerOutput'), this._layer);

            this._mapType = this._createMapType();
            ymaps.mapType.storage.add(config.get('tilerOutput'), this._mapType);

            map.options.set('projection', this._createProjection());
            map.setType(config.get('tilerOutput'));
            map.setCenter([0, 0], tileSource.getMaxZoom());

            return this;
        },
        clear: function () {
            map.setType('yandex#map');

            return this;
        },
        _createProjection: function () {
            return new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false]);
        },
        _createLayer: function (tileSource) {

            return function () {
                var layer = new ymaps.Layer('');

                layer.getTileUrl = function (tileNumber, tileZoom) {
                    tileNumber = this.restrict(tileNumber, tileZoom);

                    if(tileNumber) {
                        var tile = tileSource.getTile(tileNumber[0], tileNumber[1], tileZoom);

                        if(tile) {
                            return tile.toDataURL(config.get('tileType'));
                        }
                    }

                    return null;
                };

                layer.getZoomRange = function () {
                    var defer = new ymaps.vow.Deferred();

                    defer.resolve([tileSource.getMinZoom(), tileSource.getMaxZoom()]);

                    return defer.promise();
                };

                var monitor = new ymaps.Monitor(config);
                var sourceMonitor = new ymaps.Monitor(tileSource.options);

                sourceMonitor.add(['type', 'color'], function () {
                    console.log('!!!!', arguments);
                });

                monitor
                    .add(['layerMinZoom', 'layerMaxZoom'], function () {
                        console.log('zoomrangechange', arguments);
                        layer.events.fire('zoomrangechange');
                        layer.update();
                        /*
                        if(oldMaxZoom > maxZoom && map.getZoom() > maxZoom) {
                            map.setZoom(maxZoom);
                        }
                        */
                    })
                    .add(['tileType', 'tileColor'], function () {
                        console.log('tiles options change', arguments);
                        layer.update();
                    });


                return layer;
            };
        },
        _createMapType: function () {
            var layers = /*options.backgroundMapType?
                    ymaps.mapType.storage.get(options.backgroundMapType).getLayers() : */[];

            return new ymaps.MapType(config.get('tilerOutput'), layers.concat([config.get('tilerOutput')]));
        }
    });

    provide(TileSourceLayerMapView);
});

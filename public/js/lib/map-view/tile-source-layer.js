modules.define('map-view-tile-source-layer', [
    'inherit',
    'ymaps',
    'ymaps-map'
], function (provide, inherit, ymaps, map) {

    provide(
        inherit({
            __constructor: function () {
                this._layer = null;
            },
            render: function (tileSource, options) {
                this._layer = this._createLayer(tileSource, options);
                ymaps.layer.storage.add(options.layerName, this._layer);

                this._mapType = this._createMapType(options);
                ymaps.mapType.storage.add(options.layerName, this._mapType);

                map.options.set('projection', this._createProjection());
                map.setType(options.layerName);
                map.setCenter([0, 0], options.maxZoom);

                return this;
            },
            clear: function () {
                map.setType('yandex#map');

                return this;
            },
            _createProjection: function () {
                return new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false]);
            },
            _createLayer: function (tileSource, options) {
                var zoomRange = [options.minZoom, options.maxZoom],
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
        })
    );
});

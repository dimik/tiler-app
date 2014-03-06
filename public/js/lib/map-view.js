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

        this._layer = this._createLayer(source, options);
        // Добавим слой в хранилище слоев под ключом options.layerKey.
        ymaps.layer.storage.add(options.name, this._layer);

        this._mapType = this._createMapType(options);
        // Добавим в хранилище типов карты.
        ymaps.mapType.storage.add(options.name, this._mapType);

        this._map.setType(options.name);
        this._map.setZoom(3);

        this._map.controls.add(new ymaps.control.TypeSelector([options.name]));


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
            //config.options
                ymaps.util.extend({}, config.options, {
                    projection: new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false])
                })
        );
    },
    _createLayer: function (tileSource, options) {
        return function () {
            var layer = new ymaps.Layer('');

            layer.getTileUrl = function (tileNumber, tileZoom) {
                tileNumber = this.restrict(tileNumber, tileZoom);

                if(tileNumber) {
                    var tile = tileSource.getTile(tileNumber[0], tileNumber[1], tileZoom);

                    if(tile) {
                        return tile.toDataURL(options.tileType);
                    }
                }

                return null;
            };

            layer.getZoomRange = function () {
                var defer = new ymaps.vow.Deferred();

                defer.resolve([options.minZoom, options.maxZoom]);

                return defer.promise();
            };

            return layer;
        };
    },
    _createMapType: function (options) {
        var layers = options.backgroundMapType?
                ymaps.mapType.storage.get(options.backgroundMapType).getLayers() : [];

        return new ymaps.MapType(options.name, layers.concat([options.name]));
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

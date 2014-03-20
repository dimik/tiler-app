modules.define('map-view', [
    'inherit',
    'ymaps',
    'app-config'
], function (provide, inherit, ymaps, config) {

    provide(
        inherit({
            __constructor: function () {
                this._map = this._createMap(config['map-view']);
            },
            getMap: function () {
                return this._map;
            },
            _createMap: function (config) {
                return new ymaps.Map(
                    config.container,
                    config.state,
                    config.options
                );
            }
        })
    );
});

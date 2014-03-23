modules.define('ymaps-map', [
    'ymaps',
    'ymaps-map-config'
], function (provide, ymaps, config) {

    provide(
        new ymaps.Map(
            config.container,
            config.state,
            config.options
        )
    );
});

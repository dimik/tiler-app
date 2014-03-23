modules.define('ymaps-map-config', function (provide) {

    provide({
        container: 'map',
        state: {
            // center: [55.751574, 37.573856],
            center: [0, 0],
            zoom: 2,
            behaviors: ['default', 'scrollZoom'],
            controls: ['zoomControl', 'fullscreenControl'/*, 'typeSelector'*/]
        },
        options: {
            // zoomControlSize: 'small',
            fullscreenControlSize: 'default',
            typeSelectorFloat: 'left'
        }
    });
});

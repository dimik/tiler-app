modules.define('ymaps-map-config', function (provide) {

    provide({
        container: 'map',
        state: {
            center: [0, 0],
            zoom: 2,
            controls: ['zoomControl']
        },
        options: {}
    });
});

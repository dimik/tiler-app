requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        // ymaps: 'http://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU&mode=debug',
        // ready: '../plugins/ymaps/ready',
        // map: '../plugins/ymaps/map',
        app: '../app',
        util: 'node/util',
        canvas: 'node/canvas',
        jquery: 'jquery/jquery-2.0.3',
        inherits: 'node/inherits',
        events: 'node/events/event-emitter',
        fs: 'node/fs-disk',
        path: 'node/path',
        inflate: 'zlib.js/bin/inflate_stream.min',
        'PNGReader': 'pngjs/amd/PNGReader',
        'PNG': 'pngjs/amd/PNG',
        stream: 'node/stream/index',
        'ya-disk': 'jquery-yandex-disk/jquery-yandex-disk',
        'layer-tiler': 'layer-tiler/layer-tiler',
        tile: 'layer-tiler/tile',
        'tile-source': 'layer-tiler/tile-source',
        'image-source': 'layer-tiler/image-source',
        ymaps: '//api-maps.yandex.ru/2.1-dev/?lang=ru-RU&load=package.full&mode=debug',
        ready: 'ym/ready',
        colorpicker: 'bootstrap-colorpicker/dist/js/bootstrap-colorpicker'
    },
    config: {
        fs: {
            token: '2c60bf9fcca1486daf9d8f25134f0836'
        },
        'map-view': {
            container: 'YMapsID',
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
        },
        'layer-settings-map-view': {
            position: { right: 0, top: 0 }
        }
    },
    shim: {
        ymaps: {
            exports: 'ymaps'
        },
        jquery: {
            exports: '$'
        },
        colorpicker: {
            deps: ['jquery'],
            exports: '$.fn.colorpicker'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: '$.YaDisk'
        },
        'ya-disk': {
            deps: ['jquery'],
        },
        'inherit': {
            deps: ['jquery'],
        },
        'layer-tiler': {
            deps: ['inherit', 'vow', 'util', 'ya-disk', 'tile', 'tile-source', 'image-source']
        }
    },
    waitSeconds: 0
});

require([
    'tiler-app'
], function (TilerApp) {
    var app = new TilerApp;
});

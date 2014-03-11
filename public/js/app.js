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
        ymaps: '//api-maps.yandex.ru/2.1-dev/?lang=ru-RU&load=package.full',
        ready: 'ym/ready'
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
    'layer-tiler',
    'map-view',
    'image-reader-map-view',
    'layer-settings-map-view',
    'popup-map-view',
    'preloader-map-view'
], function (LayerTiler, MapView, ImageReaderMapView, LayerSettingsMapView, PopupMapView, PreloaderMapView) {
    var output = 'tiles-' + Date.now(),
        tiler = new LayerTiler({ output: output }),
        tileSource = tiler.getTileSource(),
        mapView = new MapView(),
        map = mapView.getMap(),
        reader = new ImageReaderMapView(map),
        settings = new LayerSettingsMapView(map),
        popup = new PopupMapView(map),
        preloader = new PreloaderMapView(map),
        sourceData;

    reader.render();

    reader.events.on('load', function (e) {
        tiler.openSource(URL.createObjectURL(e.source))
            .then(function (res) {
                sourceData = {
                    src: res.src,
                    name: e.source.name,
                    type: e.source.type,
                    size: e.source.size,
                    width: res.width,
                    height: res.height
                };

                URL.revokeObjectURL(e.source);
                reader.hide();

                tileSource.setOptions({
                    tileType: e.source.type
                });

                var sourceOptions = tileSource.getOptions();

                settings.render({
                    source: sourceData,
                    settings: jQuery.extend({}, sourceOptions, {
                        output: output,
                        tileOpacity: Math.floor(sourceOptions.tileOpacity * 100),
                        georeferenced: false,
                    })
                });

                mapView.render(tileSource, jQuery.extend({
                    name: output,
                    tileType: e.source.type
                }, tileSource.getOptions()));
            });

        settings.events
            .on('submit', function (e) {
                preloader.render({
                    progress: 0
                });

                tiler
                    .setOptions({ output: e.settings.name })
                    .render()
                    .progress(function (v) {
                        preloader.render(v);
                    })
                    .fail(function (reason) {
                        preloader.clear();
                        popup.render({
                            content: reason
                        });
                    });
            })
            .on('change', function (e) {
                tileSource.setOptions({
                    tileBackground: e.settings.tileBackground,
                    minZoom: ~~e.settings.minZoom,
                    maxZoom: ~~e.settings.maxZoom,
                    tileType: e.settings.tileType,
                    tileOpacity: e.settings.tileOpacity / 100
                });
                /*
                settings.render({
                    source: sourceData,
                    settings: e.settings
                });
                */
            })
            .on('cancel', function () {
                tiler.cancel();
            })
    })
    .on('error', function (e) {
        reader.clear();
        popup.render({
            content: e.message
        })
        .events.on('cancel', function () {
            reader.render();
        });
    });
});

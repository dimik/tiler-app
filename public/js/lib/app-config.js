modules.define('app-config', [
    'ymaps-option-manager'
], function (provide, OptionManager) {

    provide(new OptionManager({
        token: 'ad47a7d4279b4edaaf1bd3e8c91d4539',
        tilerOutput: 'tiles-' + Date.now(),

        tileUrlTemplate: '/%s/%s-%s.%s',
        tileSize: 256,
        tileType: 'image/png',
        tileColor: 'rgba(0,0,0,0.0)',
        tileOpacity: 1.0
    }));
});

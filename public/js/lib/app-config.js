modules.define('app-config', [
    'ymaps-option-manager'
], function (provide, OptionManager) {

    provide(new OptionManager({
        tilerOutput: 'tiles-' + Date.now(),
        tilerUrlTemplate: '/%s/%s/%s-%s.%s',
        tilerRetryCount: 3,

        tileSize: 256,
        tileType: 'image/png',
        tileColor: 'rgba(0,0,0,0.0)',
        tileOpacity: 1.0
    }));
});

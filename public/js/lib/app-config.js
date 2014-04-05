modules.define('app-config', [
    'ymaps-option-manager'
], function (provide, OptionManager) {

    provide(new OptionManager({
        tilerOutput: 'tiles-' + Date.now(),

        tileUrlTemplate: '/%s/%s-%s.%s',
        tileSize: 256,
        tileType: 'image/png',
        tileColor: 'rgba(0,0,0,0.0)',
        tileOpacity: 1.0
    }));
});

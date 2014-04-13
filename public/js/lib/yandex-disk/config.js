modules.define('yandex-disk-config', [
    'ymaps-option-manager',
    'app-config'
], function (provide, OptionManager, parentConfig) {

    provide(new OptionManager({
        apiUrl: '/api/yandex/disk',
        home: '/'
    }, parentConfig));
});

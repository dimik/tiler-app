modules.define('yandex-fotki-config', [
    'ymaps-option-manager',
    'app-config'
], function (provide, OptionManager, parentConfig) {

    provide(new OptionManager({
        apiUrl: '/api/yandex/fotki',
        photoUrl: '/img/yandex/fotki',
        limit: 20
    }, parentConfig));
});

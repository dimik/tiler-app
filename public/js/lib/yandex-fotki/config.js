modules.define('yandex-fotki-config', [
    'ymaps-option-manager'
], function (provide, OptionManager) {

    provide(new OptionManager({
        apiUrl: '/api/yandex/fotki',
        photoUrl: '/img/yandex/fotki',
        token: 'ad47a7d4279b4edaaf1bd3e8c91d4539',
        limit: 20
    }));
});

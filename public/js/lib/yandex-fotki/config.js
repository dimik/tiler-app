modules.define('yandex-fotki-config', [
    'ymaps-option-manager'
], function (provide, OptionManager) {

    provide(new OptionManager({
        url: '/api/yandex/fotki',
        user: 'dimik',
        token: 'ad47a7d4279b4edaaf1bd3e8c91d4539'
    }));
});

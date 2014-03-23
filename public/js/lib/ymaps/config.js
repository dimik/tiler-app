modules.define('ymaps-config', function (provide) {

    provide({
        url: 'http://api-maps.yandex.ru/2.1-dev/',
        params: {
            lang: 'ru-RU',
            load: 'package.full',
            mode: 'debug'
        }
    });
});

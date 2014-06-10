modules.define('ymaps-config', function (provide) {

    provide({
        url: 'http://api-maps.yandex.ru/2.1/',
        params: {
            // mode: 'debug',
            lang: 'ru-RU'
        }
    });
});

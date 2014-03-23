modules.define('ymaps', [
    'jQuery',
    'ymaps-config'
], function (provide, jQuery, config) {
    var apiUrl = [config.url, jQuery.param(config.params)].join('?');

    jQuery.getScript(apiUrl, function () {
        ymaps.ready
            .then(function () {
                provide(ymaps);
            });
    });
});

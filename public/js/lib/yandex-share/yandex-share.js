modules.define('yandex-share', [
    'jquery'
], function (provide, jQuery) {
    jQuery.getScript('http://yandex.st/share/share.js', function () {
        provide(window.Ya);
    });
});

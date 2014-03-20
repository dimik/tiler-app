modules.define('fs', [
    'app-config',
    'jquery-yandex-disk'
], function (provide, config, YaDisk) {

    var disk = $.YaDisk({ token: config.token });

    provide({
        writeFile: function (path, buf, fn) {
            disk.request('put', { path: path, file: buf, type: 'image/png' })
                .then(function (res) {
                    fn(null, res);
                }, fn);
        },
        mkdir: function (path, fn) {
            disk.request('mkdir', { path: path })
                .then(function (res) {
                    fn(null, res);
                }, fn);
        }
    });
});

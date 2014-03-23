modules.define('node-fs', [
    'yandex-disk-client'
], function (provide, config, disk) {

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

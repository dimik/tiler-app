modules.define('node-fs', [
    'inherit',
    'jquery',
    'yandex-disk-client',
    'jspath'
], function (provide, inherit, jQuery, YandexDiskClient, jspath) {

    var disk = new YandexDiskClient();

    var Stats = inherit({
        __constructor: function (data) {
            jQuery.extend(this, jspath.apply('.propstat.prop[0]', JSON.parse(data.toJSON())[0]));
        },
        isFile: function () {
            var resourceType = this.resourcetype;

            return typeof resourceType === 'string' && resourceType.length === 0;
        },
        isDirectory: function () {
            var resourceType = this.resourcetype;

            return typeof resourceType === 'object' && 'collection' in resourceType;
        }
    });

    provide({
        writeFile: function (path, buf, fn) {
            disk.request('put', { path: path, file: buf/*, type: 'image/png'*/ })
                .then(function (res) {
                    fn(null, res);
                }, fn);
        },
        mkdir: function (path, fn) {
            disk.request('mkdir', { path: path })
                .then(function (res) {
                    fn(null, res);
                }, fn);
        },
        chmod: function (path, mode, fn) {
            disk.request('chmod', { path: path, mode: mode })
                .then(function (res) {
                    fn(null, res);
                }, fn);
        },
        stat: function (path, fn) {
            disk.request('ls', { path: path })
                .then(function (res) {
                    fn(null, new Stats(res));
                }, fn);
        }
    });
});

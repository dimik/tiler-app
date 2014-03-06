define(function (require, exports, module) {

var config = module.config();

var inherit = require('inherit'),
    YaDisk = require('ya-disk'),
    disk = $.YaDisk({ token: config.token });

return {
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
};

});

modules.define('yandex-fotki-model', [
    'inherit',
    'jquery',
    'yandex-fotki-config'
], function (provide, inherit, jQuery, config) {

    var Model = inherit({
        stat: function () {
            return this._send({
                url: this.getUrl('/api/me/'),
                type: 'GET',
                headers: this.getHeaders()
            });
        },
        getUrl: function (path) {
            var args = Array.prototype.slice.call(arguments, 0);

            return config.url + args.join('/');
        },
        getHeaders: function (headers) {
            return jQuery.extend({
                Accept: 'application/json',
                Authorization: 'OAuth ' + config.token
            }, headers);
        },
        isMethod: function (name) {
            return this._methods.indexOf(name) >= 0;
        },
        _send: function (request) {
            return jQuery.ajax(request);
        }
    });

    provide(Model);
});

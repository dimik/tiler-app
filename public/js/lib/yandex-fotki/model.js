modules.define('yandex-fotki-model', [
    'inherit',
    'jquery',
    'yandex-fotki-config'
], function (provide, inherit, jQuery, config) {

    var Model = inherit({
        __constructor: function (token) {
            this._token = token;
            this._methods = [ 'get', 'getTags' ];
        },
        get: function () {
            return this._send({
                url: this.getUrl('/app/me/'),
                type: 'GET',
                beforeSend: function (xhr) {
                    xhr.overrideMimeType('text/plain; charset=x-user-defined');
                    // xhr.responseType = 'blob';
                },
                headers: this.getHeaders()
            });
        },
        getPreview: function (options) {
            return this._send({
                url: this.getUrl(options.path + '?preview'),
                type: 'GET',
                data: {
                    size: options.size || 'M'
                },
                beforeSend: function (xhr) {
                    xhr.overrideMimeType('text/plain; charset=x-user-defined');
                },
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
                Authorization: 'OAuth ' + this._token
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

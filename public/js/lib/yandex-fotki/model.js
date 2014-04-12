modules.define('yandex-fotki-model', [
    'inherit',
    'jquery',
    'vow',
    'node-url',
    'yandex-fotki-config'
], function (provide, inherit, jQuery, vow, url, config) {

    var Model = inherit({
        __constructor: function () {
            this._stat = null;
        },
        stat: function () {
            return this._send({
                url: this.getUrl('/api/me/'),
                type: 'GET',
                headers: this.getHeaders()
            })
            .then(function (res) {
                this._stat = res.collections;

                return res;
            }, this);
        },
        albums: function () {
            var path = url.parse(this._stat['album-list'].href).path;

            return this._send({
                url: this.getUrl(path),
                type: 'GET',
                headers: this.getHeaders()
            });
        },
        tags: function () {
            var path = url.parse(this._stat['tag-list'].href).path;

            return this._send({
                url: this.getUrl(path),
                type: 'GET',
                headers: this.getHeaders()
            });
        },
        photos: function (href) {
            var path = url.parse(href || this._stat['photo-list'].href).path;

            return this._send({
                url: this.getUrl(path),
                type: 'GET',
                headers: this.getHeaders()
            });
        },
        getUrl: function (path) {
            var args = Array.prototype.slice.call(arguments, 0);

            return config.get('apiUrl') + args.join('/');
        },
        getHeaders: function (headers) {
            return jQuery.extend({
                Accept: 'application/json',
                Authorization: 'OAuth ' + config.get('token')
            }, headers);
        },
        isMethod: function (name) {
            return this._methods.indexOf(name) >= 0;
        },
        _send: function (request) {
            var defer = vow.defer();

            jQuery.ajax(request)
                .then(function (res) {
                    defer.resolve(res);
                }, function (err) {
                    defer.reject(err);
                });

            return defer.promise();
        }
    });

    provide(Model);
});

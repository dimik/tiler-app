var HTTPClient = require('http-client'),
    Vow = require('vow'),
    inherit = require('inherit'),
    url = require('url'),
    xml2js = require('xml2js'),
    client = new HTTPClient();

var YaDisk = module.exports = inherit(/** @lends YaDisk.prototype */ {
    __constructor: function (options) {
        this._model = new YaDisk.Model(options.token);
    },
    getModel: function () {
        return this._model;
    }
});

YaDisk.Model = inherit(/** @lends YaDisk.Model.prototype */ {
    __constructor: function (token) {
        this._url = 'https://webdav.yandex.ru';
        this._token = token;
    },
    get: function (path) {
        return this._send({
            url: this.getUrl(path),
            method: 'GET',
            headers: this.getHeaders()
        });
    },
    getpreview: function (path, size) {
        return this._send({
            url: this.getUrl(path + '?preview'),
            method: 'GET',
            data: {
                size: size || 'M'
            },
            headers: this.getHeaders()
        });
    },
    put: function (path, file, type) {
        return this._send({
            url: this.getUrl(path),
            method: 'PUT',
            data: file,
            headers: this.getHeaders({
                'Content-Type': 'application/' + type || 'binary'
            })
        });
    },
    cp: function (source, target) {
        return this._send({
            url: this.getUrl(source),
            method: 'copy',
            headers: this.getHeaders({
                Destination: url.resolve('/', target)
            })
        });
    },
    mv: function (source, target) {
        return this._send({
            url: this.getUrl(source),
            method: 'MOVE',
            headers: this.getHeaders({
                Destination: url.resolve('/', target)
            })
        });
    },
    rm: function (path) {
        return this._send({
            url: this.getUrl(path),
            method: 'DELETE',
            headers: this.getHeaders()
        });
    },
    mkdir: function (path) {
        return this._send({
            url: this.getUrl(path),
            method: 'MKCOL',
            headers: this.getHeaders()
        });
    },
    ls: function (path, options) {
        return this._send({
            url: this.getUrl(path),
            data: options,
            method: 'PROPFIND',
            headers: this.getHeaders({
                Depth: '1'
            })
        });
    },
    id: function () {
        return this._send({
            url: this.getUrl('?userinfo'),
            method: 'GET',
            headers: this.getHeaders()
        });
    },
    chmod: function (path, mode) {
        var modes = {
                'a+r': [
                    '<set>',
                        '<prop>',
                            '<public_url xmlns="urn:yandex:disk:meta">true</public_url>',
                        '</prop>',
                    '</set>'
                ],
                'a-r': [
                    '<remove>',
                        '<prop>',
                            '<public_url xmlns="urn:yandex:disk:meta"/>',
                        '</prop>',
                    '</remove>'
                ]
            },
            requestBody = [
                '<propertyupdate xmlns="DAV:">',
                    modes[mode || 'a-r'].join(''),
                '</propertyupdate>'
            ].join('');

        return this._send({
            url: this.getUrl(path),
            method: 'PROPPATCH',
            data: requestBody,
            headers: this.getHeaders()
        });
    },
    df: function () {
        var requestBody = [
                '<propfind xmlns="DAV:">',
                    '<prop>',
                        '<quota-available-bytes/>',
                        '<quota-used-bytes/>',
                    '</prop>',
                '</propfind>'
            ].join('');

        return this._send({
            url: this.getUrl(),
            method: 'PROPFIND',
            data: requestBody,
            headers: this.getHeaders({
                Depth: '0'
            })
        });
    },
    getUrl: function (paths) {
        var args = Array.prototype.slice.call(arguments, 0);

        return url.resolve(this._url, args.join('/'));
    },
    getHeaders: function (headers) {
        return this._extend({
            Authorization: 'OAuth ' + this._token
        }, headers);
    },
    _send: function (request) {
        var promise = Vow.promise();

        client.open(request, function (err, res) {
            if(err) {
                promise.reject(err);
            }
            else {
                promise.fulfill(res);
            }
        });

        return promise;
    },
    _extend: function (target, source) {
        var slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        slice.call(arguments, 1).forEach(function (o) {
            for(var key in o) {
                hasOwnProperty.call(o, key) && (target[key] = o[key]);
            }
        });

        return target;
    }
});

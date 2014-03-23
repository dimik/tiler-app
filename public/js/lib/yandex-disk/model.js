modules.define('yandex-disk-model', [
    'inherit',
    'jquery',
    'yandex-disk-config'
], function (provide, inherit, jQuery, config) {

    provide(
        inherit({
            __constructor: function (token) {
                this._token = token;
                this._methods = [ 'get', 'getPreview', 'put', 'cp', 'mv', 'rm', 'ls', 'mkdir', 'chmod', 'id', 'df' ];
            },
            get: function (options) {
                return this._send({
                    url: this.getUrl(options.path),
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
            put: function (options) {
                return this._send({
                    url: this.getUrl(options.path),
                    type: 'PUT',
                    data: options.file,
                    processData: false,
                    contentType: options.type || false,
                    headers: this.getHeaders()
                });
            },
            cp: function (options) {
                return this._send({
                    url: this.getUrl(options.source),
                    type: 'COPY',
                    headers: this.getHeaders({
                        Destination: options.target
                    })
                });
            },
            mv: function (options) {
                return this._send({
                    url: this.getUrl(options.source),
                    type: 'MOVE',
                    headers: this.getHeaders({
                        Destination: options.target
                    })
                });
            },
            rm: function (options) {
                return this._send({
                    url: this.getUrl(options.path),
                    type: 'DELETE',
                    headers: this.getHeaders()
                });
            },
            mkdir: function (options) {
                return this._send({
                    url: this.getUrl(options.path),
                    type: 'MKCOL',
                    headers: this.getHeaders()
                });
            },
            ls: function (options) {
                return this._send({
                    url: this.getUrl(options.path),
                    type: 'PROPFIND',
                    data: {
                        amount: options.amount,
                        offset: options.offset
                    },
                    headers: this.getHeaders({
                        Depth: '1'
                    })
                });
            },
            id: function () {
                return this._send({
                    url: this.getUrl('?userinfo'),
                    type: 'GET',
                    headers: this.getHeaders()
                });
            },
            chmod: function (options) {
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
                            modes[options.mode || 'a-r'].join(''),
                        '</propertyupdate>'
                    ].join('');

                return this._send({
                    url: this.getUrl(options.path),
                    type: 'PROPPATCH',
                    data: requestBody,
                    processData: false,
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
                    type: 'PROPFIND',
                    data: requestBody,
                    processData: false,
                    headers: this.getHeaders({
                        Depth: '0'
                    })
                });
            },
            getUrl: function (path) {
                var args = Array.prototype.slice.call(arguments, 0);

                return config.url + args.join('/');
            },
            getHeaders: function (headers) {
                return jQuery.extend({
                    Authorization: 'OAuth ' + this._token
                }, headers);
            },
            isMethod: function (name) {
                return this._methods.indexOf(name) >= 0;
            },
            _send: function (request) {
                return jQuery.ajax(request);
            }
        })
    );
});

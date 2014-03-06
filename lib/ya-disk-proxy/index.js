var http = require('http'),
    util = require('util'),
    inherit = require('inherit'),
    HTTPClient = require('handy-http'),
    client = new HTTPClient(),
    url = require('url'),
    _extend = function (target, source) {
        var slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        slice.call(arguments, 1).forEach(function (o) {
            for(var key in o) {
                hasOwnProperty.call(o, key) && (target[key] = o[key]);
            }
        });

        return target;
    };


var YaDiskProxy = module.exports = inherit(/** @lends YaDiskProxy.prototype */{
    __constructor: function () {
        this._server = new http.Server(this._onRequest.bind(this));
    },
    _onRequest: function (req, res) {
        if(req.method === 'OPTIONS') {
            res.writeHead(200, this._getCORSHeaders(req));
            res.end();
        }
        else {
            this.proxyRequest(req, res);
        }
    },
    _getCORSHeaders: function (request) {
        var origin = request.headers.origin || this.__self.CORS_ALLOW_ORIGIN,
            headers = request.headers['access-control-request-headers'] || this.__self.CORS_ALLOW_HEADERS.concat(
                Object.keys(request.headers).filter(function (header) {
                    return header.indexOf('x-') === 0;
                })
            ).join(', ');

        return {
            'access-control-allow-methods'     : this.__self.CORS_ALLOW_METHODS.join(', '),
            'access-control-max-age'           : this.__self.CORS_MAX_AGE,
            'access-control-allow-headers'     : headers,
            'access-control-allow-credentials' : this.__self.CORS_ALLOW_CREDENTIALS,
            'access-control-allow-origin'      : origin
        };
    },
    listen: function () {
        return this._server.listen.apply(this._server, arguments);
    },
    proxyRequest: function (req, res) {
        var response,
            headers = this._getCORSHeaders(req),
            setHeader = function (header, index, headers) {
                res.setHeader(header.toLowerCase(), this[header]);
            };

            console.log('Request url: ', this.__self.URL + req.url);
            console.log('Request method: ', req.method);
            console.log('Request headers: ', _extend({}, req.headers, { host: url.parse(this.__self.URL).host }));
            // console.log('Request data: ', req);

        client.open({
            url: this.__self.URL + req.url,
            method: req.method,
            data: req,
            headers: _extend({}, req.headers, { host: url.parse(this.__self.URL).host })
        }, function (err, result) {
            if(err || !response) {
                res.writeHead(500, 'Internal server error', headers);
            }
            else {
                Object.keys(response.headers).forEach(setHeader, response.headers);
                Object.keys(headers).forEach(setHeader, headers);
                console.log('response headers: ', response.headers);
                console.log('response code: ', response.statusCode);
                console.log('response result: ', result);


                res.writeHead(response.statusCode);
                res.write(result);
            }
            res.end();
        })
        .once('response', function (res) {
            response = res;
        });
    }
}, {
    URL: 'https://webdav.yandex.ru',
    CORS_ALLOW_HEADERS: ['accept', 'accept-charset', 'accept-encoding', 'accept-language', 'authorization', 'content-length', 'content-type', 'host', 'origin', 'proxy-connection', 'referer', 'user-agent', 'x-requested-with', 'depth', 'destination'],
    CORS_ALLOW_METHODS: ['HEAD', 'POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'PROPFIND', 'PROPPATCH', 'COPY', 'MOVE', 'MKCOL'],
    CORS_ALLOW_ORIGIN: '*',
    CORS_ALLOW_CREDENTIALS: 'true',
    CORS_MAX_AGE: '86400' // 24 hours
});

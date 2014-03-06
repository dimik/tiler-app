var http = require('http'),
    inherit = require('inherit'),
    url = require('url'),
    Vow = require('vow'),
    util = require('util'),
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

var TilerServer = module.exports = inherit(http.Server, /** @lends Server.prototype */{
    __constructor: function (options) {
        this._options = this._extend({}, this.getDefaults(), typeof options === 'string'? url.parse(options) : options);
        this._listeners = [];
    },
    start: function () {
        var options = this._options,
            promise = Vow.promise();

        this._server.listen(options.port, options.host, options.backlog, function (err) {
            if(err) {
                promise.reject(err);
            }
            else {
                promise.fulfill();
            }
        });

        return promise;
    },
    stop: function () {
        var promise = Vow.promise();

        this._server.close(function () {
            promise.fulfill();
        });

        return promise;
    },
    route: function (route, data, fn, ctx) {
        if(typeof data === 'function') {
            ctx = fn;
            fn = data;
        }

    },
    unroute: function (route, fn, ctx) {
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
    },
    getDefaults: function () {
        return {
            host: '127.0.0.1',
            port: 1337,
            backlog: 1024
        };
    }
});

var Request = inherit(http.IncomingMessage,/** @lends Request.prototype */{
    __constructor: function () {
        this.__base.apply(this, arguments);
    }
});

var Response = inherit(http.ServerResponse,/** @lends Response.prototype */{
    __constructor: function () {
        this.__base.apply(this, arguments);
    },
    setCookie: function (name, value, options) {
        this.setHeader('Set-Cookie', encodeURIComponent(name) + '=' + encodeURIComponent(value) + [
                options.expires? '; expires=' + options.expires.toUTCString() : '',
                options.path? '; path=' + options.path : '',
                options.domain? '; domain=' + options.domain : '',
                options.secure? '; secure' : ''
            ].join('')
        );

        return this;
    },
    clearCookie: function (name, options) {
        var opts = { expires: new Date(1) };

        return this.setCookie(name, '', options? _extend(opts, options) : opts);
    }
});

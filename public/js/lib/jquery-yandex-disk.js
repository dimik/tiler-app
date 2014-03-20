modules.define('jquery-yandex-disk', [
    'jquery'
], function (provide, jQuery) {

(function ($) {

YaDisk.Path = function (cwd) {
    this._cwd = cwd;
};

YaDisk.Path.prototype = {
    constructor: YaDisk.Path,
    normalize: function (path) {
        var sep = YaDisk.Path.SEP,
            dirs = path.split(sep),
            result = [];

        for(var i = 0, len = dirs.length; i < len; i++) {
            switch (dirs[i]) {
                case '.':
                    break;
                case '..':
                    result.pop();
                    break;
                case '':
                    if(i > 0 && i < len - 1) {
                        break;
                    }
                default:
                    result.push(dirs[i]);
            }
        }

        return result.join(sep);
    },
    resolve: function () {
        var args = Array.prototype.slice.call(arguments, 0),
            sep = YaDisk.Path.SEP,
            len = args.length,
            path, result = [];

        while(len--) {
            if(!(path = args[len])) {
                continue;
            }

            result.unshift(path);

            if(YaDisk.Path.isAbsolute(path)) {
                break;
            }
            else if(len === 0) {
                result.unshift(this._cwd);
            }
        }

        return this.normalize(result.join(sep));
    },
    join: function () {
        var args = Array.prototype.slice.call(arguments, 0),
            sep = YaDisk.Path.SEP;

        return this.normalize(args.join(sep));
    }
};

YaDisk.Path.SEP = '/';

/**
 * Similar to the Unix basename command.
 * @function
 * @static
 * @name Path.basename
 * @param {String} path
 * @returns {String} The last portion of a path.
 */
YaDisk.Path.basename = function (path, ext) {
    var sep = this.SEP;

    if(path === sep) {
        return path;
    }

    var paths = path.split(sep),
        result = paths[paths.length - 1];

    if(ext) {
        if(result.substring(result.length - ext.length) === ext) {
            result = result.substring(0, result.length - ext.length);
        }
    }

    return result;
};

/**
 * Similar to the Unix dirname command.
 * @function
 * @static
 * @name Path.dirname
 * @param {String} path
 * @returns {String} The directory name of a path.
 */
YaDisk.Path.dirname = function (path) {
    var sep = this.SEP;

    if(path === sep) {
        return path;
    }
    else if(path.indexOf(sep) > -1) {
        return path.split(sep).slice(0, -1).join(sep);
    }
    else {
        return '.';
    }
};

/**
 * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
 * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.
 * @function
 * @static
 * @name Path.extname
 * @param {String} path
 * @returns {String} The extension of the path.
 */
YaDisk.Path.extname = function (path) {
    return (path.match(/\.\w*$/) || [''])[0];
};

/**
 * Return true if path is absolute.
 * @function
 * @static
 * @name Path.isAbsolute
 * @param {String} path
 * @returns {Boolean} Whether the path is absolute.
 */
YaDisk.Path.isAbsolute = function (path) {
    return path.charAt(0) === this.SEP;
};

YaDisk.DirectoryStack = function (cwd) {
    YaDisk.Path.call(this, cwd);
    this._stack = [ cwd ];
};

YaDisk.DirectoryStack.prototype = $.extend({}, YaDisk.Path.prototype, {
    constructor: YaDisk.DirectoryStack,
    pushd: function (dir) {
        var stack = this._stack;

        if(!dir || dir === '-') {
            stack.push.apply(stack, stack.splice(-2, 2).reverse());
        }
        else {
            var path = this.resolve(dir),
                index = stack.indexOf(path),
                inStack = index > -1;

            inStack && stack.splice(index, 1);
            stack.push(path);
        }

        this._cwd = stack[stack.length - 1];

        return stack;
    },
    popd: function () {
        var stack = this._stack;

        if(stack.length > 1) {
            stack.pop();
        }
        this._cwd = stack[stack.length - 1];

        return stack;
    },
    dirs: function () {
        return this._stack;
    },
    pwd: function () {
        return this._cwd;
    }
});

YaDisk.Model = function (token) {
    this._token = token;
    this._methods = [ 'get', 'getPreview', 'put', 'cp', 'mv', 'rm', 'ls', 'mkdir', 'chmod', 'id', 'df' ];
};

YaDisk.Model.prototype = {
    constructor: YaDisk.Model,
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

        return YaDisk.Model.URL + args.join('/');
    },
    getHeaders: function (headers) {
        return $.extend({
            Authorization: 'OAuth ' + this._token
        }, headers);
    },
    isMethod: function (name) {
        return this._methods.indexOf(name) >= 0;
    },
    _send: function (request) {
        return $.ajax(request);
    }
};

YaDisk.Model.URL = 'http://127.0.0.1:8002';

function YaDisk(options) {
    if(!(this instanceof YaDisk)) {
        return new YaDisk(options);
    }

    YaDisk.DirectoryStack.call(this, YaDisk.HOME);
    this._model = new YaDisk.Model(options.token);
};

YaDisk.prototype = $.extend({}, YaDisk.DirectoryStack.prototype, {
    constructor: YaDisk,
    getModel: function () {
        return this._model;
    },
    request: function (method, args) {
        var defer = $.Deferred(),
            model = this._model,
            path = this.resolve(args && args.path);

        if(model.isMethod(method)) {
            model[method]($.extend({}, args, { path: path }))
                .then(function (res, status, jqXHR) {
                    var contentType = jqXHR.getResponseHeader('content-type');

                    switch(contentType && contentType.split(';')[0]) {
                        case 'application/xml': // ls, df
                            defer.resolve(new YaDisk.XMLView(res));
                            break;
                        case 'text/plain': // id
                            // defer.resolve(new YaDisk.TextView(res));
                            // defer.resolve((new YaDisk.ImageView(res)).toImage(contentType));
                            defer.resolve(new YaDisk.FileView(res));
                            break;
                        case null: // getPreview
                        case 'text/plain; charset=x-user-defined':
                            // defer.resolve(new YaDisk.FileView(res));
                            defer.resolve(res);
                            break;
                        case 'image/jpeg':
                        case 'image/png':
                            defer.resolve((new YaDisk.ImageView(res)).toImage(contentType));
                            break;
                        default: // get
                            defer.resolve(res);
                    }
                })
                .fail(function () {
                    defer.reject.apply(defer, arguments);
                });
        }
        else {
            defer.reject('There is no method "' + method + '"');
        }

        return defer.promise();
    },
    cd: function (dir) {
        var defer = $.Deferred(),
            path = this.resolve(dir),
            done = $.proxy(function (dir) {
                this.pushd(dir);
                defer.resolve(path);
            }, this),
            fail = function (err) {
                defer.reject(err);
            };

        if(!dir || dir === '~') {
            setTimeout(function () {
                done(YaDisk.HOME);
            }, 0);
        }
        else {
            if(this.dirs().indexOf(path) > -1) {
                setTimeout(function () {
                    done(dir);
                }, 0);
            }
            else {
                this.request('ls', { path: path })
                    .then(function (res) {
                        var resource = JSON.parse(res.toJSON())[0],
                            resourcetype = resource.propstat.prop.resourcetype || {};

                        if('collection' in resourcetype) {
                            done(dir);
                        }
                        else {
                            fail('not a directory');
                        }
                    },
                    function (err) {
                        fail('no such file or directory');
                    });
            }
        }

        return defer.promise();
    }
});

YaDisk.HOME = '/';

YaDisk.ImageView = function (src, type) {
    this._data = src;
};

YaDisk.ImageView.prototype = {
    constructor: YaDisk.ImageView,
    getType: function () {
        return 'image';
    },
    valueOf: function () {
        return this._data;
    },
    toDataURL: function (type) {
        var defer = $.Deferred(),
            reader = new FileReader(),
            blob = this.toBlob(type);

        reader.onload = function (e) {
            defer.resolve(e.target.result);
        };
        reader.onerror = function (e) {
            defer.reject(e.target.error);
        };
        reader.onprogress = function (e) {
            defer.notify(
                Math.round((e.loaded / e.total) * 100)
            );
        };

        reader.readAsDataURL(blob);

        return defer.promise();
    },
    toImage: function (type) {
        var img = new Image();

        if(window.URL) {
            img.src = URL.createObjectURL(this.toBlob(type));
        }
        else {
            this.toDataURL(type)
                .then(function (dataURL) {
                    img.src = dataURL;
                });
        }

        return img;
    },
    toBlob: function (type) {
        return toBlob(this._data, type);
    }
};

YaDisk.ImageView.dataURLtoBlob = function (dataURL) {
    var data = dataURL.split(';base64,');

    return toBlob(window.atob(data[1]), data[0].split(':')[1]);
};

function toBlob(data, type) {
    var bytes = data.length,
        view = new Uint8Array(new ArrayBuffer(bytes));

    for(var i = 0; i < bytes; i++) {
        view[i] = data.charCodeAt(i);
    }

    return new Blob([ view.buffer ], { type: type || 'application\/octet-stream' });
}

YaDisk.FileView = function (data) {
    this._data = data;
};

YaDisk.FileView.prototype = {
    constructor: YaDisk.FileView,
    getType: function () {
        return 'file';
    },
    valueOf: function () {
        return this._data;
    },
    toUrl: function (type) {
        return (window.URL || window.webkitURL).createObjectURL(
            this.toBlob(type)
        );
    },
    toBlob: function (type) {
        return toBlob(this._data, type);
    },
    download: function () {
        window.location.assign(this.toUrl());
    }
};

YaDisk.XMLView = function (xml) {
    this._data = xml;
};

YaDisk.XMLView.prototype = {
    constructor: YaDisk.XMLView,
    getType: function () {
        return 'xml';
    },
    valueOf: function () {
        return this._data;
    },
    toString: function () {
        return this.valueOf();
    },
    toXML: function () {
        return this.valueOf();
    },
    toJSON: function () {
        return this._parseNodes(this._data.firstChild.childNodes);
    },
    _parseNodes: function (nodes) {
        var result = [];

        for(var i = 0, len = nodes.length; i < len; i++) {
            result.push(
                this._parseNode(nodes[i].firstChild)
            );
        }

        return '[' + result.join() + ']';
    },
    _parseNode: function (node) {
        var result = [], child;

        do {
            result.push(
                '"' + this._getLocalName(node) + '":' + (
                    (child = node.firstChild) && child.nodeType === 1?
                        this._parseNode(child) : '"' + this._getNodeValue(node) + '"'
                )
            );
        } while(node = node.nextSibling);

        return '{' + result.join() + '}';
    },
    _getLocalName: function (node) {
        return node.nodeName.replace(/\w*:?/, '');
    },
    _getNodeValue: function (node) {
        var child = node.firstChild;

        return child?
            child.nodeValue : '';
    }
};

YaDisk.TextView = function (text) {
    this._data = text;
};

YaDisk.TextView.prototype = {
    constructor: YaDisk.TextView,
    getType: function () {
        return 'text';
    },
    toJSON: function () {
        var data = this._data.split(':'),
            result = [];

        for(var i = 0, len = data.length; i < len; i += 2) {
            result.push('"' + data[i] + '":"' + data[i + 1] + '"');
        }

        return '[{"propstat":{"status":"HTTP/1.1 200 OK","prop":{' + result.join() + '}}}]';
    },
    toXML: function () {
        var data = this._data.split(':'),
            result = [];

        for(var i = 0, len = data.length; i < len; i += 2) {
            result.push(
                '<' + data[i] + '>' + data[i + 1] + '</' + data[i] + '>'
            );
        }

        return $([
            '<multistatus xmlns="DAV:">',
                '<response>',
                    '<propstat>',
                        '<status>HTTP/1.1 200 OK</status>',
                        '<prop>',
                            result.join(''),
                        '</prop>',
                    '</propstat>',
                '</response>',
            '</multistatus>'
        ].join('')).get(0);
    },
    valueOf: function () {
        return this._data;
    },
    toString: function () {
        return this.valueOf();
    }
};

provide(
    $.YaDisk = YaDisk
);

}(jQuery));

});

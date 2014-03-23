modules.define('yandex-disk-client', [
    'inherit',
    'jquery',
    'vow',
    'node-path',
    'yandex-disk-model',
    'yandex-disk-directory-stack',
    'yandex-disk-text-view',
    'yandex-disk-xml-view',
    'yandex-disk-file-view',
    'yandex-disk-image-view',
    'yandex-disk-config'
], function (provide, inherit, jQuery, vow, path, Model, DirectoryStack, TextView, XMLView, FileView, ImageView, config) {

    var YandexDiskClient = inherit(DirectoryStack, {
        __constructor: function () {
            this.__base.call(this, config.home);

            this._model = new Model(config.token);
        },
        getModel: function () {
            return this._model;
        },
        request: function (method, args) {
            var defer = vow.defer(),
                model = this._model;

            if(model.isMethod(method)) {
                model[method](jQuery.extend({}, args, {
                    path: path.resolve(args && args.path)
                }))
                    .then(function (res, status, jqXHR) {
                        var contentType = jqXHR.getResponseHeader('content-type');

                        switch(contentType && contentType.split(';')[0]) {
                            case 'application/xml': // ls, df
                                defer.resolve(new XMLView(res));
                                break;
                            case 'text/plain': // id
                                // defer.resolve(new TextView(res));
                                // defer.resolve((new ImageView(res)).toImage(contentType));
                                defer.resolve(new FileView(res));
                                break;
                            case null: // getPreview
                            case 'text/plain; charset=x-user-defined':
                                // defer.resolve(new FileView(res));
                                defer.resolve(res);
                                break;
                            case 'image/jpeg':
                            case 'image/png':
                                defer.resolve((new ImageView(res)).toImage(contentType));
                                break;
                            default: // get
                                defer.resolve(res);
                        }
                    })
                    .fail(function (err) {
                        defer.reject(err);
                    });
            }
            else {
                defer.reject('There is no method "' + method + '"');
            }

            return defer.promise();
        },
        cd: function (dir) {
            var defer = vow.defer(),
                done = jQuery.proxy(function (dir) {
                    this.pushd(dir);
                    defer.resolve(dir);
                }, this),
                fail = function (err) {
                    defer.reject(err);
                };

            if(!dir || dir === '~') {
                done(config.home);
            }
            else {
                if(this.dirs().indexOf(path) > -1) {
                    done(dir);
                }
                else {
                    this.request('ls', { path: path.resolve(dir) })
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

    provide(YandexDiskClient);
});

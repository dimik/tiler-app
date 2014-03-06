var Vow = require('vow'),
    inherit = require('inherit'),
    HTTPClient = require('handy-http'),
    client = new HTTPClient();

var TilerRouter = module.exports = inherit(/** @lends TilerRouter.prototype */{
    __constructor: function (model) {
        this._users = model;
    },
    root: function (req, res) {
        var uid = req.cookies.uid,
            onSuccess = function (doc) {
                if(doc) {
                    res.send('ok');
                }
                else {
                    onFail('User with uid "' + uid + '" not found');
                }
            },
            onFail = function (err) {
                console.log(err);
                // res.redirect('/login');
                res.sendfile(process.cwd() + '/public/index.html');
            };

        if(uid) {
            this._users.get(uid)
                .then(onSuccess, onFail);
        }
        else {
            onFail('Cookie "uid" not found');
        }
    },
    login: function (req, res) {
        res.sendfile(process.cwd() + '/public/login.html');
    },
    auth: function (req, res) {
        var code = req.param('code'),
            onSuccess = function (id) {
                res.cookie('uid', id);
                res.location('/');
            },
            onFail = function (err) {
                res.location('/login/');
            };

        if(code) {
            this.getAccessToken(code)
                .then(this.getUserID, onFail, this)
                .then(onSuccess, onFail);
        }
        else {
            onFail('Access code not found');
        }
    },
    getAccessToken: function (code) {
        var promise = Vow.promise();

        client.open({
            url: 'https://oauth.yandex.ru/token',
            method: 'POST',
            data: {
                grant_type: 'authorization_code',
                code: code,
                client_id: '9843ecf1ffb54e8b8d5ef5223a32c810',
                client_secret: 'bcb85b2d4f464e1e85504c6ed9503b9d'
            }
        }, function (err, res) {
            var token = res && res.access_token;

            if(err || !token) {
                promise.reject(err || 'Token not found');
            }
            else {
                promise.fulfill(token);
            }
        });

        return promise;
    },
    getUserID: function (token) {
        var promise = Vow.promise(),
            users = this._users;

        users.getUserByToken(token)
            .then(function (doc) {
                if(doc) {
                    promise.fulfill(doc._id.toString());
                }
                else {
                    promise.sync(users.createUser({
                        credentials: [
                            { service: 'disk', token: token }
                        ]
                    }));
                }
            }, function (err) {
                promise.reject(err);
            });

        return promise;
    },

});

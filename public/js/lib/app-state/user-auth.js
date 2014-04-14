modules.define('app-state-user-auth', [
    'inherit',
    'jquery-cookie',
    'node-querystring',
    'app-state-base',
    'ymaps-layout-user-auth',
    'app-config'
], function (provide, inherit, cookie, querystring, AppStateBase, UserAuthLayout, config) {

    var UserAuthState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'user-auth';
        },
        init: function () {
            var token,
                params = querystring.parse(window.location.hash.substring(1)),
                next = function () {
                    config.set('token', token);
                    this._changeState('image-load');
                }.bind(this);

            if(token = cookie('token')) {
                next();
            }
            else if(token = params.access_token) {
                cookie('token', token, {
                    expires: params.expires_in / 60 / 60 / 24
                });
                next();
            }
            else {
                this._app.popup
                    .render('popup#userAuth');
            }
        },
        destroy: function () {
            this._app.popup
                .clear();
        }
    });

    provide(UserAuthState);
});

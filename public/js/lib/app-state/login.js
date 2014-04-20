modules.define('app-state-login', [
    'inherit',
    'jquery-cookie',
    'node-querystring',
    'app-state-base',
    'ymaps-layout-user-login',
    'app-config'
], function (provide, inherit, cookie, querystring, AppStateBase, UserLoginLayout, config) {

    var LoginState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'login';
        },
        init: function () {
            var token,
                params = querystring.parse(window.location.hash.substring(1)),
                next = function () {
                    config.set('token', token);
                    this._changeState('load');
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
                    .render('userLogin');
            }
        },
        destroy: function () {
            this._app.popup
                .clear();
        }
    });

    provide(LoginState);
});

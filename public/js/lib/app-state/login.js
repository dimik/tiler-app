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
            this._name = 'login';
            this._title = 'Авторизация';

            this.__base.apply(this, arguments);
        },
        init: function () {
            var params = querystring.parse(window.location.hash.substring(1));

            this.__base.call(this);

            var token,
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

            this.__base.call(this);
        }
    });

    provide(LoginState);
});

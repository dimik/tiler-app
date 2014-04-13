modules.define('app-state-user-auth', [
    'inherit',
    'jquery-cookie',
    'app-state-base',
    'app-config'
], function (provide, inherit, jQuery, AppStateBase, config) {

    var UserAuthState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'user-auth';
        },
        init: function () {
            var token = jQuery.cookie('token');

            if(token) {
                config.set('token', token);
                this._changeState('image-load');
            }
            else {
                this._app.auth.render();
            }
        },
        destroy: function () {
            this._app.auth.clear();
        }
    });

    provide(UserAuthState);
});

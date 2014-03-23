modules.define('app-state-user-auth', [
    'inherit',
    'jquery',
    'app-state-base'
], function (provide, inherit, jQuery, AppStateBase) {

    var UserAuthState = inherit(AppStateBase, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this._name = 'user-auth';
            setTimeout(function () {
            modules.define('yandex-disk-config', function (provide, prev) {
                debugger;

                provide(jQuery.extend(prev, {
                    token: '2c60bf9fcca1486daf9d8f25134f0836'
                }));
            });
            }, 1000);
            this._changeState('image-load');
        }
    });

    provide(UserAuthState);
});

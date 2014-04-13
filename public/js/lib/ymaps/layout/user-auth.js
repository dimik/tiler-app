modules.define('ymaps-layout-user-auth', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var UserAuthLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well span10 offset1">',
            '<div class="row-fluid">',
                '<p class="lead">Приложение &laquo;Подготовка слоя тайлов&raquo; позволяет автоматизировать процесс подготовки произвольного изображения для показа на веб-странице с помощью API Яндекс.Карт.</p>',
                '<p class="lead">Приложение использует Яндекс.Диск в качестве сервиса хранения изображений (тайлов).</p>',
                '<blockquote>',
                    '<p>Яндекс.Диск — облачный сервис, принадлежащий компании Яндекс, позволяющий пользователям хранить свои данные на серверах в облаке и передавать их другим пользователям в Интернете.</p>',
                '</blockquote>',
                '<br/>',
                '<p class="lead">Для работы приложения необходимо пройти процедуру авторизации на Яндекс.Паспорте.</p>',
                '<a class="btn btn-primary btn-large" href="https://oauth.yandex.ru/authorize?response_type=token&client_id=9843ecf1ffb54e8b8d5ef5223a32c810">Авторизоваться на Яндексе</a>',
            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            UserAuthLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._attachHandlers();
        },
        clear: function () {
            this._detachHandlers();

            UserAuthLayout.superclass.build.apply(this, arguments);
        },
        _attachHandlers: function () {
        },
        _detachHandlers: function () {
        }
    });

    provide(UserAuthLayout);
});

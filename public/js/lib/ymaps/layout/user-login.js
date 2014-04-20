modules.define('ymaps-layout-user-login', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var UserLoginLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well well-white user-login">',
            '<h1>Подготовка слоя тайлов</h1>',
            '<p class="lead">Приложение &laquo;Подготовка слоя тайлов&raquo; позволяет автоматизировать<br/>процесс подготовки произвольного изображения<br/>для показа на веб-странице с помощью <strong>API&nbsp;Яндекс.Карт</strong>.</p>',
            '<p class="lead">Приложение использует <strong>Яндекс.Диск</strong> в качестве сервиса<br/>хранения изображений&nbsp;(тайлов).</p>',
            '<!--blockquote>',
                '<p>Яндекс.Диск — облачный сервис, принадлежащий компании Яндекс, позволяющий пользователям хранить свои данные на серверах в облаке и передавать их другим пользователям в Интернете.</p>',
            '</blockquote-->',
            '<br/>',
            '<p class="lead">Для работы приложения необходимо пройти процедуру<br/>авторизации на&nbsp;Яндекс.Паспорте.</p>',
            '<a class="btn btn-success btn-large" href="https://oauth.yandex.ru/authorize?response_type=token&client_id=9843ecf1ffb54e8b8d5ef5223a32c810">Авторизоваться на Яндексе</a>',
        '</div>'
    ].join(''));

    ymaps.option.presetStorage
        .add('popup#userLogin', {
            contentBodyLayout: UserLoginLayout
        });

    provide(UserLoginLayout);
});

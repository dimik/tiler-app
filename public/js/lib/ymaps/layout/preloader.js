modules.define('ymaps-layout-preloader', [
    'ymaps'
], function (provide, ymaps) {

    provide(
        ymaps.templateLayoutFactory.createClass([
            '<div class="well preloader">',
                '<p>{{ data.message }}</p>',
                '<div class="progress progress-striped active">',
                    '<div class="bar" style="width:{{ data.progress }}%;"></div>',
                '</div>',
            '</div>'
        ].join(''))
    );
});

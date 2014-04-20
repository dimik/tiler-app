modules.define('ymaps-layout-preloader', [
    'ymaps'
], function (provide, ymaps) {

    var PreloaderLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well well-white preloader">',
            '<p>{{ data.message }}</p>',
            '<div class="progress progress-striped active">',
                '<div class="bar" style="width:{{ data.processed }}%;"></div>',
                '<div class="bar bar-danger" style="width:{{ data.processing }}%;"></div>',
            '</div>',
        '</div>'
    ].join(''));

    ymaps.option.presetStorage
        .add('popup#preloader', {
            contentBodyLayout: PreloaderLayout
        });

    provide(PreloaderLayout);
});

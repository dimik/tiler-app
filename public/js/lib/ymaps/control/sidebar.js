modules.define('ymaps-control-sidebar', [
    'inherit',
    'ymaps',
    'ymaps-control-base'
], function (provide, inherit, ymaps, BaseControl) {

    var ContentLayout = ymaps.templateLayoutFactory.createClass([
            '<div>',
                '{% if options.contentBodyLayout %}',
                    '{% include options.contentBodyLayout %}',
                '{% endif %}',
            '</div>'
        ].join(''));

    var SidebarControl = inherit(BaseControl, {
        __constructor: function () {
            this.__base.apply(this, arguments);

            this.options.set({
                contentLayout: ContentLayout,
                float: 'none',
                position: { top: 0, right: 0 }
            });
        }
    });

    provide(SidebarControl);
});

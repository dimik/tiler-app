modules.define('layer-tiler-config', [
    'ymaps-option-manager',
    'app-config'
], function (provide, OptionManager, parentConfig) {

    provide(new OptionManager({}, parentConfig, 'tiler'));
});

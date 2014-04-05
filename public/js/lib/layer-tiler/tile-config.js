modules.define('tile-config', [
    'ymaps-option-manager',
    'app-config'
], function (provide, OptionManager, parentConfig) {

    provide(new OptionManager({}, parentConfig, 'tile'));
});

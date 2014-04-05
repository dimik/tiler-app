modules.define('ymaps-option-manager', [
    'ymaps',
    'ymaps-option-mapper'
], function (provide, ymaps, mapper) {

    function OptionManager(options, parent, name) {
        var manager = new ymaps.option.Manager(options, parent, name);

        manager.resolve = function (key, name) {
            return this.get(mapper.resolve(key, name));
        };

        return manager;
    }

    provide(OptionManager);
});

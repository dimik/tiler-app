define(['ready!ymaps', 'module'], function (ymaps, module) {

var config = module.config();

return function () {
    return new ymaps.Map(
        config.container,
        config.state,
        config.options
    );
};

});

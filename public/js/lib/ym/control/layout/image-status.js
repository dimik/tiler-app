define(['ready!ymaps'], function (ymaps) {

return ymaps.templateLayoutFactory.createClass([
    '<div class="media image-status">',
        '<img width="64" height="64" class="media-object pull-left img-polaroid" data-src="holder.js/64x64" src="{{ data.source.src }}">',
        '<div class="media-body">',
            '<h4 class="media-heading">{{ data.source.name|raw }}</h4>',
            '<small><span class="label label-success">{{ data.source.type }}</span></small><br/>',
            '<small>{{ data.source.width}}x{{ data.source.height }} пикс</small><br/>',
            '<small>{{ data.source.size|raw }}</small>',
        '</div>',
    '</div>'
].join(''));

});

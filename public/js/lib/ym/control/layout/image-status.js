define(['ready!ymaps'], function (ymaps) {

return ymaps.templateLayoutFactory.createClass([
    '<div class="media image-status">',
        '<img width="64" height="64" class="media-object pull-left img-polaroid" data-src="holder.js/64x64" src="{{ data.imageUrl }}">',
        '<div class="media-body">',
            '<h4 class="media-heading">{{ data.imageName|raw }}</h4>',
            '<small><span class="label label-success">{{ data.imageType }}</span></small><br/>',
            '<small>{{ data.imageWidth}}x{{ data.imageHeight }} пикс</small><br/>',
            '<small>{{ data.imageSize|raw }}</small>',
        '</div>',
    '</div>'
].join(''));

});

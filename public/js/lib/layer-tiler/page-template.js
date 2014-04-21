modules.define('layer-tiler-page-template', [
    'inherit'
], function (provide, inherit) {

var template = [
'<!DOCTYPE html>',
'<html xmlns="http://www.w3.org/1999/xhtml">',
'<head>',
'    <title>Пользователькая карта.</title>',
'    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>',

'    <style type="text/css">',
'        html, body, #map {',
'            padding: 0;',
'            margin: 0;',
'            width: 100%;',
'            height: 100%;',
'        }',
'    </style>',

'    <script type="text/javascript" src="http://api-maps.yandex.ru/2.1-dev/?lang=ru-RU&load=package.full"></script>',
'    <script type="text/javascript">',
'        ymaps.ready(function () {',
'            var layerName = "user#layer";',
'            var zoomRange = [${layerMinZoom}, ${layerMaxZoom}];',
'            var Layer = function () {',
'                var layer = new ymaps.Layer("./%z/%x-%y.${tileType}");',

'                layer.getZoomRange = function () {',
'                    var defer = ymaps.vow.defer();',

'                    defer.resolve(zoomRange);',

'                    return defer.promise();',
'                };',

'                return layer;',
'            };',
'            ymaps.layer.storage.add(layerName, Layer);',
'            var mapType = new ymaps.MapType(layerName, [layerName]);',
'            ymaps.mapType.storage.add(layerName, mapType);',

'            var map = new ymaps.Map("map", {',
'                center: [0, 0],',
'                zoom: 0,',
'                type: layerName,',
'                controls: ["zoomControl"]',
'            }, {',
'                projection: new ymaps.projection.Cartesian([[-10, -10], [10, 10]], [false, false])',
'            });',
'        });',
'    </script>',
'</head>',
'<body>',
'    <div id="map"></div>',
'</body>',
'</html>'
].join('\n');

var PageTemplate = inherit({
    __constructor: function () {
        this._template = template;
    },
    render: function (data) {
        return this.build(data);
    },
    build: function (data) {
        return this._template.replace(/\$\{([^}]+)\}/g, function (match, name) {
            var value = data[name];
            return typeof value != 'undefined'? value : '';
        });
    }
});

provide(PageTemplate);

});

var Vow = require('vow'),
    fs = require('fs');

function PageRenderer(options) {
    this._options = options;
    this._page = null;
}

PageRenderer.prototype = {
    constructor: PageRenderer,
    render: function (data) {
        var replaceByKey = function (s, key) {
            return data[key];
        };

        return PageRenderer.TEMPLATE
            .replace(/\$\{(\w+)\}/g, replaceByKey);

        return this;
    },
    save: function (url) {
        var text = this._page,
            promise = Vow.promise();

        fs.writeFile(url, text, function (err) {
            if(err) {
                promise.reject(err);
            }
            else {
                promise.fulfill(text.length);
            }
        });

        return promise;
    }
};

PageRenderer.TEMPLATE = '
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ru" lang="ru">
<head>
    <title>Пользовательский слой.</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <link href="/bootstrap/css/bootstrap.css" rel="stylesheet">

    <script src="http://api-maps.yandex.ru/2.0/?load=package.standard&lang=ru-RU" type="text/javascript"></script>

    <script type="text/javascript">
        var options = {
                tileUrlTemplate: "./tiles/%z/tile-%x-%y.png",
                controls: {
                    typeControl: true,
                    miniMap: true,
                    toolBar: true,
                    scaleLine: true
                },
                scrollZoomEnabled: true,
                mapCenter: new YMaps.GeoPoint(-177.940063476563, 84.9204024523413),
                backgroundMapType: YMaps.MapType.NONE,
                mapZoom: 8,
                isTransparent: true,
                smoothZooming: false,
                layerKey: "my#layer",
                mapType: {
                    name: "Мой слой",
                    textColor: "#000000"
                },
                copyright: "",
                layerMinZoom: ${minZoom},
                layerMaxZoom: ${maxZoom}
            };

        ymaps.ready(function () {
            // Передаем его в конструктор класса TilerConverter и получаем ссылку на карту.
            var myMap = (new TilerConverter(options)).getMap();
        });
    </script>
    <style type="text/css">
        #YMapsID {
            width: 900px;
            height: 400px;
        }
    </style>
</head>
<body>
    <div class="hero-unit">
        <div class="container">
            <p>Пользовательский слой</p>
            <div id="YMapsID"></div>
        </div>
    </div>
</body>
</html>
';

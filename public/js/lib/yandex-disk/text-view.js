modules.define('yandex-disk-text-view', [
    'inherit',
    'jquery',
    'yandex-disk-base-view'
], function (provide, inherit, jQuery, BaseView) {

    var TextView = inherit(BaseView, {
        toJSON: function () {
            var data = this._data.split(':'),
                result = [];

            for(var i = 0, len = data.length; i < len; i += 2) {
                result.push('"' + data[i] + '":"' + data[i + 1] + '"');
            }

            return '[{"propstat":{"status":"HTTP/1.1 200 OK","prop":{' + result.join() + '}}}]';
        },
        toXML: function () {
            var data = this._data.split(':'),
                result = [];

            for(var i = 0, len = data.length; i < len; i += 2) {
                result.push(
                    '<' + data[i] + '>' + data[i + 1] + '</' + data[i] + '>'
                );
            }

            return jQuery([
                '<multistatus xmlns="DAV:">',
                    '<response>',
                        '<propstat>',
                            '<status>HTTP/1.1 200 OK</status>',
                            '<prop>',
                                result.join(''),
                            '</prop>',
                        '</propstat>',
                    '</response>',
                '</multistatus>'
            ].join('')).get(0);
        },
        toString: function () {
            return this.valueOf();
        }
    });

    provide(TextView);
});

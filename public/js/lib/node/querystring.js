modules.define('node-querystring', function (provide) {
    provide({
        parse: function (s) {
            var match,
                re = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); },
                params = {};

            while(match = re.exec(s)) {
                params[decode(match[1])] = decode(match[2]);
            }

            return params;
        }
    });
});

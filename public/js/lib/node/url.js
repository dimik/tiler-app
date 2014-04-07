modules.define('node-url', function (provide) {

    provide({
        parse: function (s) {
            var re = /(\w+:)?\/\/([^\/]+)(([^\?]+)\??(.*))/;
                matches = re.exec(s),
                getMatch = function (index) {
                    return matches[index] || '';
                },
                query = getMatch(5);

            return {
                href: getMatch(0),
                protocol: getMatch(1),
                host: getMatch(2),
                hostname: getMatch(2),
                path: getMatch(3),
                pathname: getMatch(4),
                search: query.length? '?' + query : '',
                query: query
            };
        }
    });
});

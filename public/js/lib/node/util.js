modules.define('node-util', function (provide) {

    provide({
        format: function (template) {
            if(typeof template !== 'string') {
                return Array.prototype.slice.call(arguments).join(' ');
            }

            var i = 0,
                args = Array.prototype.slice.call(arguments, 1),
                len = args.length;

            var str = template.replace(/%./g, function (s) {
                if(i >= len && s !== '%%') {
                    return s;
                }

                switch(s) {
                    case '%s': return String(args[i++]);
                    case '%d': return Number(args[i++]);
                    case '%j': return JSON.stringify(args[i++]);
                    case '%%': return '%';
                    default: return s;
                }
            });

            for(var x = args[i]; i < len; x = args[++i]) {
                str += ' ' + x;
            }

            return str;
        }
    });
});

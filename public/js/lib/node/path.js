modules.define('node-path', [
    'inherit'
], function (provide, inherit) {

    var Path = inherit({
        __constructor: function (cwd) {
            this._cwd = cwd || '/';
        },
        normalize: function (path) {
            var sep = this.sep,
                dirs = path.split(sep),
                result = [];

            for(var i = 0, len = dirs.length; i < len; i++) {
                switch (dirs[i]) {
                    case '.':
                        break;
                    case '..':
                        result.pop();
                        break;
                    case '':
                        if(i > 0 && i < len - 1) {
                            break;
                        }
                    default:
                        result.push(dirs[i]);
                }
            }

            return result.join(sep);
        },
        resolve: function () {
            var args = Array.prototype.slice.call(arguments, 0),
                sep = this.sep,
                len = args.length,
                path, result = [];

            while(len--) {
                if(!(path = args[len])) {
                    continue;
                }

                result.unshift(path);

                if(this._isAbsolute(path)) {
                    break;
                }
                else if(len === 0) {
                    result.unshift(this._cwd);
                }
            }

            return this.normalize(result.join(sep));
        },
        join: function () {
            var args = Array.prototype.slice.call(arguments, 0);

            return this.normalize(args.join(this.sep));
        },
        /**
         * Similar to the Unix basename command.
         * @function
         * @name Path.basename
         * @param {String} path
         * @returns {String} The last portion of a path.
         */
        basename: function (path, ext) {
            var sep = this.sep;

            if(path === sep) {
                return path;
            }

            var paths = path.split(sep),
                result = paths[paths.length - 1];

            if(ext) {
                if(result.substring(result.length - ext.length) === ext) {
                    result = result.substring(0, result.length - ext.length);
                }
            }

            return result;
        },
        /**
         * Similar to the Unix dirname command.
         * @function
         * @name Path.dirname
         * @param {String} path
         * @returns {String} The directory name of a path.
         */
        dirname: function (path) {
            var sep = this.sep;

            if(path === sep) {
                return path;
            }
            else if(path.indexOf(sep) > -1) {
                return path.split(sep).slice(0, -1).join(sep);
            }
            else {
                return '.';
            }
        },
        /**
         * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
         * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string.
         * @function
         * @name Path.extname
         * @param {String} path
         * @returns {String} The extension of the path.
         */
        extname: function (path) {
            return (path.match(/\.\w*$/) || [''])[0];
        },
        /**
         * Return true if path is absolute.
         * @function
         * @private
         * @name Path._isAbsolute
         * @param {String} path
         * @returns {Boolean} Whether the path is absolute.
         */
        _isAbsolute: function (path) {
            return path.charAt(0) === this.sep;
        },
        sep: '/'
    });

    provide(new Path('/'));
});

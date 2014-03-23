modules.define('yandex-disk-directory-stack', [
    'inherit',
    'node-path'
], function (provide, inherit, path) {

    var DirectoryStack = inherit({
        __constructor: function (cwd) {
            this._stack = [
                this._cwd = cwd || '/'
            ];
        },
        pushd: function (dir) {
            var stack = this._stack;

            if(!dir || dir === '-') {
                stack.push.apply(stack, stack.splice(-2, 2).reverse());
            }
            else {
                var p = path.resolve(dir),
                    index = stack.indexOf(p),
                    inStack = index > -1;

                inStack && stack.splice(index, 1);
                stack.push(p);
            }

            this._cwd = stack[stack.length - 1];

            return stack;
        },
        popd: function () {
            var stack = this._stack;

            if(stack.length > 1) {
                stack.pop();
            }
            this._cwd = stack[stack.length - 1];

            return stack;
        },
        dirs: function () {
            return this._stack;
        },
        pwd: function () {
            return this._cwd;
        }
    });

    provide(DirectoryStack);
});

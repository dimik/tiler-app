modules.define('vow-node', [
    'vow'
], function (provide, vow) {
    var slice = Array.prototype.slice;

    provide({
        promisify : function(nodeFn) {
            return function() {
                var args = slice.call(arguments);
                args.unshift(nodeFn);
                return vowNode.invoke.apply(this, args);
            }
        },

        invoke : function(nodeFn) {
            var deferred = vow.defer(),
                args = slice.call(arguments, 1);

            args.push(function(err, val) {
                err === null?
                    deferred.resolve(val) :
                    deferred.reject(err);
            });

            try {
                nodeFn.apply(this, args);
            }
            catch(e) {
                deferred.reject(e);
            }

            return deferred.promise();
        }
    });
});

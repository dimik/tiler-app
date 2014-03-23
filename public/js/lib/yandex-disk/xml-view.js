modules.define('yandex-disk-xml-view', [
    'inherit',
    'yandex-disk-base-view'
], function (provide, inherit, BaseView) {

    var XMLView = inherit(BaseView, {
        toString: function () {
            return this.valueOf();
        },
        toXML: function () {
            return this.valueOf();
        },
        toJSON: function () {
            return this._parseNodes(this._data.firstChild.childNodes);
        },
        _parseNodes: function (nodes) {
            var result = [];

            for(var i = 0, len = nodes.length; i < len; i++) {
                result.push(
                    this._parseNode(nodes[i].firstChild)
                );
            }

            return '[' + result.join() + ']';
        },
        _parseNode: function (node) {
            var result = [], child;

            do {
                result.push(
                    '"' + this._getLocalName(node) + '":' + (
                        (child = node.firstChild) && child.nodeType === 1?
                            this._parseNode(child) : '"' + this._getNodeValue(node) + '"'
                    )
                );
            } while(node = node.nextSibling);

            return '{' + result.join() + '}';
        },
        _getLocalName: function (node) {
            return node.nodeName.replace(/\w*:?/, '');
        },
        _getNodeValue: function (node) {
            var child = node.firstChild;

            return child?
                child.nodeValue : '';
        }
    });

    provide(XMLView);
});

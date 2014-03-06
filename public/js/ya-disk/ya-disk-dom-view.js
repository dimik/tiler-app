YaDisc.DOMView = $.inherit(/** @lends YaDisc.DOMView.prototype */ {
    __constructor: function (container) {
        this._container = container;
        this.events = $({});
    },
    render: function (data) {
        this._container
            .append(
                this._createNavList(data)
            )
            .show();
        this._attachHandlers();

        return this;
    },
    clear: function () {
        this._detachHandlers();
        this._container
            .hide()
            .empty();

        return this;
    },
    _attachHandlers: function () {
        this._container
            .on('click', 'li', $.proxy(this._onResourceClick, this));
    },
    _detachHandlers: function () {
        this._container
            .off('click');
    },
    _onResourceClick: function (e) {
        var target = $(e.currentTarget);

        this.events.trigger($.Event(target.attr('data-action'), {
            resource: target.attr('data-url')
        }));
    },
    _createNavList: function (data) {
        var list = [
                '<div class="well">',
                    '<ul class="nav nav-list">',
                        this._createNavListItems(data),
                    '</ul>',
                '</div>'
            ];

        return list.join('');
    },
    _createNavListItems: function (data) {
        var items = [
            this._createNavListActiveItem(data[0])
        ];

        for(var i = 1, len = data.length; i < len; i++) {
            items.push(this._createNavListItem(data[i]));
        }

        return items.join('');
    },
    _createNavListActiveItem: function (data) {
        var item = [
                '<li class="active" data-url="${url}" data-action="updirectory">',
                    '<a href="#"><i class="icon-folder-open"></i> ${name}</a>',
                '</li>'
            ].join('');

        return this._jTemplate(item, {
            name: data.displayname,
            url: data.href
        });
    },
    _createNavListItem: function (data) {
        var item = [
                '<li data-url="${url}" data-action="${action}">',
                    '<a href="#"><i class="icon-${icon}"></i> ${name}</a>',
                '</li>'
            ].join('');

        return this._jTemplate(item, {
            url: data.href,
            name: data.displayname,
            icon: this._getResourceIcon(data),
            action: this._getResourceAction(data)
        });
    },
    _jTemplate: function (s, data) {
        return s.replace(/\$\{(\w+)\}/g, function () {
            return data[arguments[1]];
        });
    },
    _formatResourceDate: function (s) {
        var date = new Date(s);

        return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
    },
    _getResourceType: function (resource) {
        return resource.resourcetype || 'file';
    },
    _getResourceAction :function (resource) {
        var type = this._getResourceType(resource);

        return type === 'collection'?
            'changedirectory' : 'fileinfo';
    },
    _getResourceIcon: function (resource) {
        return /png|jpeg/.test(resource.getcontenttype)?
            'picture' : this._getResourceType(resource) === 'collection'?
                'folder-close' : 'file';
    },
    _getResourceSize: function (resource) {
        var len = resource.getcontentlength,
            size = len / 1024,
            postfix = 'K';

        return len == 0? '' : Math.round(
            size > 1024?
                (postfix = 'M', size) / 1024 :
                size < 1? (postfix = 'B', len) : size
        ) + postfix;
    }
});

modules.define('ymaps-layout-file-image-loader', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var FileImageLoaderLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well well-white file-image-loader">',
            '<div class="row-fluid">',
                '<div class="drop-zone">',
                    '<p class="lead">Перетащите ваше изображение в эту область</p>',
                '</div>',
            '</div>',
            '<div class="row-fluid">',
                '<div class="file-control-group">',
                    '<a class="btn btn-info" href="#">',
                        '<i class="icon-folder-open icon-white"></i>',
                        '&nbsp;Выбрать&nbsp;файл',
                    '</a>',
                '</div>',
                '<div class="ya-fotki-control-group">',
                    '<a class="btn btn-success" href="#" data-loader="image">Выбрать&nbsp;на&nbsp;Яндекс.Фотках</a>',
                '</div>',
            '</div>',
            '<input type="file" class="input-file-hidden" name="image-file"></input>',
        '</div>'
    ].join(''), {
        build: function () {
            FileImageLoaderLayout.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._attachHandlers();
        },
        clear: function () {
            this._detachHandlers();

            FileImageLoaderLayout.superclass.build.apply(this, arguments);
        },
        _attachHandlers: function () {
            jQuery(document)
                .on('dragover', jQuery.proxy(this._onDragOver, this))
                .on('drop', jQuery.proxy(this._onDrop, this))
                .on('change', ':file', jQuery.proxy(this._onFileChange, this));

            this._$element
                .on('click', '.btn-info', jQuery.proxy(this._onFileOpen, this))
                .on('click', '.btn-success', jQuery.proxy(this._onLoaderSelect, this));
        },
        _detachHandlers: function () {
            this._$element
                .off('click', '.btn-info')
                .off('click', '.btn-success');

            jQuery(document)
                .off('dragover')
                .off('drop')
                .off('change', ':file');
        },
        _onDragOver: function (e) {
            // Эта инструкция разрешает перетаскивание.
            e.preventDefault();

            var isDropZone = this._isDropZone(e.target),
                dropzone = this._getDropZone();

            dropzone
                .toggleClass('success', isDropZone)
                .toggleClass('error', !isDropZone);

            // dropEffect должен совпадать с effectAllowed.
            // e.originalEvent.dataTransfer.dropEffect = 'copy';
        },
        _onDrop: function (e) {
            // не работает в FF =) поэтому делаем return false вконце
            // e.stopPropagation();

            var isDropZone = this._isDropZone(e.target);

            this._getDropZone()
                .removeClass('success error');

            if(isDropZone) {
                this._fireEvent(e.originalEvent.dataTransfer.files[0]);
            }

            return false;
        },
        _onFileChange: function (e) {
            return this._fireEvent(e.target.files[0]);
        },
        _onLoaderSelect: function (e) {
            e.preventDefault();

            this.getData().control.state
                .set('loader', jQuery(e.target).data('loader'));
        },
        _onFileOpen: function (e) {
            e.preventDefault();

            this._$element.find(':file')
                .trigger('click');
        },
        _fireEvent: function (file) {
            var control = this.getData().control;

            control.events.fire('load', {
                target: control,
                image: {
                    url: URL.createObjectURL(file),
                    name: file.name,
                    type: file.type,
                    size: file.size
                }
            });

            return false;
        },
        _isDropZone: function (el) {
            var $el = jQuery(el),
                dropzone = this._getDropZone();

            return $el.is(dropzone) || $el.parent().is(dropzone);
        },
        _getDropZone: function () {
            return this._$element.find('.drop-zone');
        }
    });

    ymaps.option.presetStorage
        .add('popup#fileImageLoader', {
            contentBodyLayout: FileImageLoaderLayout
        });

    provide(FileImageLoaderLayout);
});

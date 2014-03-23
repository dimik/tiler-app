modules.define('ymaps-layout-image-loader', [
    'ymaps',
    'jquery'
], function (provide, ymaps, jQuery) {

    var ImageLoaderLayout = ymaps.templateLayoutFactory.createClass([
        '<div class="well image-loader">',
            '<div class="row-fluid">',
                '<div class="drop-zone">',
                    '<p class="lead">Перетащите ваше изображение в эту область</p>',
                '</div>',
            '</div>',
            '<div class="row-fluid">',
                '<div class="file-control-group">',
                    '<a class="btn btn-info" href="javascript:void(0);">',
                        '<i class="icon-folder-open icon-white"></i>',
                        '&nbsp;Выбрать&nbsp;файл',
                        '<input type="file" class="input-file-hidden" name="image-file" size="40">',
                    '</a>',
                '</div>',
                '<div class="ya-fotki-control-group">',
                    '<a class="btn btn-success" href="javascript:void(0);">Выбрать&nbsp;на&nbsp;Яндекс.Фотках</a>',
                '</div>',
            '</div>',
        '</div>'
    ].join(''), {
        build: function () {
            this.constructor.superclass.build.apply(this, arguments);

            this._$element = jQuery(this.getElement());

            this._attachHandlers();
        },
        clear: function () {
            this._detachHandlers();

            this.constructor.superclass.build.apply(this, arguments);
        },
        _attachHandlers: function () {
            jQuery(document)
                .on('dragover', jQuery.proxy(this._onDragOver, this))
                .on('drop', jQuery.proxy(this._onDrop, this))
                .on('change', ':file', jQuery.proxy(this._onFile, this));
        },
        _detachHandlers: function () {
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
                .removeClass('success error')

            if(isDropZone) {
                this._fireEvent(e.originalEvent.dataTransfer.files[0]);
            }

            return false;
        },
        _onFile: function (e) {
            return this._fireEvent(e.target.files[0]);
        },
        _fireEvent: function (file) {
            var control = this.getData().control;

            control.events.fire('load', {
                target: control,
                source: file
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

    provide(ImageLoaderLayout);
});

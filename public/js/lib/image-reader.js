define(['inherit', 'vow', 'jquery', 'image-reader-map-view', 'module'], function (inherit, vow, $, MapView, module) {

var config = module.config();

var ImageReader = inherit(/** @lends ImageReader.prototype */{
    __constructor: function () {
        /**
         * Добавим свойство dataTransfer в объект-событие,
         * чтобы не доставать его каждый раз из e.originalEvent.
         */
        $.event.props.push('dataTransfer');
        this.events = $({});
        this._attachHandlers();
    },
    _attachHandlers: function () {
        $(document)
            .on('dragstart', this._onDragStart)
            .on('dragover', this._onDragOver)
            .on('drop', $.proxy(this._onDrop, this));
    },
    _detachHandlers: function () {
        $(document)
            .off('dragstart')
            .off('dragover')
            .off('drop');
    },
    _onDragStart: function (e) {
        // Будем перетаскивать в режиме копирования (броузер добавит "+" при перетаскивании)
        e.dataTransfer.effectAllowed = 'copy';
        // Кладем в данные идентификатор.
        // e.dataTransfer.setData('TEXT', this.id);
    },
    _onDragOver: function (e) {
        // Эта инструкция разрешает перетаскивание.
        e.preventDefault();
        // dropEffect должен совпадать с effectAllowed.
        e.dataTransfer.dropEffect = 'copy';
    },
    _onDrop: function (e) {
        // не работает в FF =) поэтому делаем return false вконце
        // e.stopPropagation();

        this._readFile(e.dataTransfer.files[0]);

        return false;
    },

    _readFile: function (file) {
        var img = new Image();

        this.events.trigger($.Event('load', {
            source: URL.createObjectURL(file),
            file: file
        }));
    }
});

return ImageReader;

});

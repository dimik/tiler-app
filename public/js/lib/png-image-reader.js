define(function (require, exports, module) {

    var inherit = require('inherit'),
        Vow = require('vow'),
        inflate = require('inflate'),
        $ = require('jquery');

    var ImageReader = module.exports = inherit(/** @lends ImageReader.prototype */{
        __constructor: function () {
            /**
             * Добавим свойство dataTransfer в объект-событие,
             * чтобы не доставать его каждый раз из e.originalEvent.
             */
            $.event.props.push('dataTransfer');
            this.events = $({});
            this._attachHandlers();
            this._reader = new PNG();
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

        var reader = this._reader.open(file);

        function getChunk(reader) {
            var chunk = { offset: reader.getIndex() },
                promise = Vow.promise();

            reader.read(4)
                .then(function (res) {
                    chunk.length = (new PNGDataView(res)).getUint32();
                    return reader.read(4);
                })
                .then(function (res) {
                    chunk.type = (new PNGDataView(res)).toString();
                    console.log('type: ', chunk.type, 'length: ', chunk.length);
                    return reader.read(chunk.length);
                })
                .then(function (res) {
                    // chunk.data = (new PNGDataView(res)).toUint8Array();
                    return reader.read(4);
                })
                .then(function (res) {
                    // chunk.crc = res.getUint32();
                    promise.fulfill(chunk);
                })
                .fail(function (err) {
                    promise.reject(err);
                });

            return promise;
        }

        function getChunks(reader) {
            var chunks = [],
                promise = Vow.promise(),
                fn = function () {
                    getChunk(reader)
                        .then(function (chunk) {

                            chunks.push(chunk);

                            if(chunk.type === 'IEND') {
                                promise.fulfill(chunks);
                            }
                            else {
                                fn();
                            }
                        });
                };

            fn();

            return promise;
        }

        reader.read(8)
            .then(function (res) {
                console.log('header: ', (new PNGDataView(res)).getUint8());
                return getChunks(reader);
            })
            .then(function (chunks) {
                console.log('chunks: ', chunks);
                var idats = chunks.filter(function (chunk) { return chunk.type === 'IDAT'; }),
                    chunk1 = idats[0],
                    offset = chunk1.offset,
                    length = chunk1.length;
                    /*
                idats.forEach(function (chunk) {
                    length += chunk.length;
                });
                */

                console.log('png data offset: ', offset, 'png data length: ', length);

                var inflator = new Zlib.InflateStream();

                console.log(inflator);

//                for(var s = 0, e = 0; e < length; s = e, e += 10000) {
                var s = offset + 8, e = 1000001;
                    console.log(s, e);
                    reader.setIndex(s)
                        .read(e)
                        .then(function (data) {
                            try{
                            var decoded = inflator.decompress(new Uint8Array(data));
                            console.log('decoded length: ', decoded.length, 'ip: ', inflator.getIndex());
                            } catch(e) {
                                console.log(e);
                            }
                        });

//                }
                /*
                var chunk1 = idats[0];
                    console.log(chunk1.length / 2);

                var data1 = new Uint8Array(chunk1.data.buffer, 0, chunk1.length / 2);
                var data2 = new Uint8Array(chunk1.data.buffer, chunk1.length / 2);


                var decoded1 = inflator.decompress(data1);
                console.log('decoded1: ', decoded1, 'length: ', decoded1.length);

                var decoded2 = inflator.decompress(data2);
                console.log('decoded2: ', decoded2, 'length: ', decoded2.length);
                */
/*
                var view = new Uint8Array(length);

                idats.forEach(function (chunk) {
                    view.set(chunk.data, offset);
                    offset += chunk.length;
                });

                var inflator = new Zlib.Inflate(view);

                var decoded = inflator.decompress();

                console.log('decoded: ', decoded, 'length: ', decoded.length);
                */

            })

/*
            var events = this.events,
                r = new FileReader(),
                clear = function () {
                    r.onload =
                    r.onerror =
                    r.onprogress = null;
                };

            r.onload = function (e) {
                events.trigger($.Event('load', {
                    source: r,
                    image: e.target.result
                }));
                clear();
            };

            r.onerror = function (e) {
                events.trigger($.Event('error', {
                    source: r,
                    message: e.target.error
                }));
                clear();
            };

            r.onprogress = function (e) {
                events.trigger($.Event('notify', {
                    source: r,
                    progress: Math.round((e.loaded / e.total) * 100)
                }));
            };

            // r.readAsArrayBuffer((file.slice || file.webkitSlice)(0, 8));
            r.readAsArrayBuffer(file);
            */
        }
    });

    function PNGReader(file) {
        this._index = 0;
        this._file = null;
    }

    PNGReader.prototype = {
        constructor: PNGReader,
        open: function (file) {
            this._file = file;

            return this;
        },
        getIndex: function () {
            return this._index;
        },
        setIndex: function (index) {
            this._index = index;

            return this;
        },
        read: function (length) {
            var promise = Vow.promise(),
                reader = new FileReader();

            reader.onload = function (e) {
                promise.fulfill(new PNGDataView(e.target.result));
            };

            reader.onerror = function (e) {
                promise.reject(e.target.error);
            };

            reader.onprogress = function (e) {
                promise.notify(Math.round((e.loaded / e.total) * 100));
            };

            reader.readAsArrayBuffer(this._file.slice(this._index, this._index += length));

            return promise;
        },
        _getChunk: function () {
            var chunk = { offset: this.getIndex() },
                promise = Vow.promise();

            this.read(4)
                .then(function (res) {
                    chunk.length = res.getUint32();
                    return this.read(4);
                }, this)
                .then(function (res) {
                    chunk.type = res.toString();
                    console.log('type: ', chunk.type, 'length: ', chunk.length);
                    return this.read(chunk.length);
                }, this)
                .then(function (res) {
                    // chunk.data = res.toUint8Array();
                    return this.read(4);
                }, this)
                .then(function (res) {
                    // chunk.crc = res.getUint32();
                    promise.fulfill(chunk);
                })
                .fail(function (err) {
                    promise.reject(err);
                });

            return promise;
        },
        _getChunks: function () {
            var chunks = [],
                promise = Vow.promise(),
                onChunk = function (chunk) {
                    chunks.push(chunk);
                    if(chunk.type === 'IEND') {
                        promise.fulfill(chunks);
                    }
                    else {
                        this._getChunk().then(onChunk, onError, this);
                    }
                },
                onError = function (err) {
                    promise.reject(err);
                };

            this.getChunk().then(onChunk, onError, this);

            return promise;
        },
        readHeader: function () {
            return this.read(8);
        },
        parse: function () {
            var promise = Vow.promise();

            this.readHeader()
                .then(function (res) {
                    return this._getChunks();
                }, this)
                .then(function (chunks) {
                    this._dataChunks = chunks.filter(function (chunk) { return chunk.type === 'IDAT'; });

                    this._dataChunks.forEach(function (chunk) {
                        this._dataLength += chunk.length;
                    }, this);
                }, this)
        },
        processChunk: function (chunk) {

        }
    };

    function PNGDataView(data) {
        this._data = data;
    }

    PNGDataView.prototype = {
        constructor: PNGDataView,
        toUint8Array: function (offset, length) {
            return new Uint8Array(this._data, offset, length);
        },
        getUint8: function (offset) {
            var view = new DataView(data);

            return view.getUint8(offset >> 0);
        },
        getUint16: function (offset) {
            var view = new DataView(data);

            return view.getUint16(offset >> 0);
        },
        getUint32: function (offset) {
            var view = new DataView(data);

            return view.getUint32(offset >> 0);
        },
        toString: function () {
            return String.fromCharCode.apply(String, this.toUint8Array());
        }
    };
/*
    function PNG() {
        this.width = 0;
        this.height = 0;
        this.bitDepth = 0;
        this.colorType = 0;
        this.compressionMethod = 0;
        this.filterMethod = 0;
        this.interlaceMethod = 0;

        this.colors = 0;
        this.alpha = false;
        this.pixelBits = 0;

        this.palette = null;
        this.pixels = null;
    }
    */


});

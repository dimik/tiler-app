define(function (require, exports, module) {

    module.exports = Buffer;

    function Buffer(subject, encoding) {
        switch(typeof subject) {
            case 'string':
                this.length = Buffer.byteLength(subject, encoding = encoding || 'utf8');
                break;
            case 'number':
                this.length = subject > 0 ? Math.floor(subject) : 0;
                break;
            case: 'object':
                this.length = +subject.length > 0 ? Math.floor(+subject.length) : 0;
                break;
            default:
                throw new TypeError('must start with number, buffer, array or string');
        }

        if(subject instanceof ArrayBuffer || Array.isArray(subject)) {
            this.parent = new Uint8Array(subject);
        }
        else {
            this.parent = new Uint8Array(new ArrayBuffer(this.length));
        }

        if(Buffer.isBuffer(subject)) {
            subject.copy(this, 0, 0, this.length);
        }
        else if(typeof subject === 'string') {
            this.write(subject, 0, encoding);
        }
    }

    Buffer.prototype = {
        constructor: Buffer,
        toString: function (encoding, start, end) {
            return this.parent.buffer.toString(encoding, start, end);
        },
        get: function (index) {
            return this.parent[index];
        },
        set: function (index, value) {
            if(Array.isArray(value) || value instanceof ArrayBuffer) {
                this.parent.set(value, index);
            }
            else {
                this.parent[index] = value;
            }
        },
        write: function (string, offset, length, encoding) {
        },
        slice: function (start, end) {
            return new Buffer(this.parent.buffer.slice(start, end));
        },
        copy: function (targetBuffer, targetStart, sourceStart, sourceEnd) {
            targetBuffer.set(this.parent.buffer.slice(sourceStart, sourceEnd));
        }
    };

    var views = {
        Int8: 'Int8',
        UInt8: 'UInt8',
        UInt16LE: 'UInt16',
        UInt16BE: 'Uint16',
        UInt32LE: 'UInt32',
        UInt32BE: 'UInt32',
    }

    for(var view in views) {
        Buffer.prototype['read' + view] = function (offset, noAssert) {
            return (new DataView(this.parent.buffer))['get' + views[view]](offset, view.substr(-2, 2) === 'LE');
        };
        Buffer.prototype['write' + view] = function (offset, noAssert) {
            return (new DataView(this.parent.buffer))['set' + views[view]](offset, view.substr(-2, 2) === 'LE');
        };
    }

    Buffer.isBuffer = function (subject) {
        return subject instanceof Buffer;
    };

    Buffer.isEncoding = function (encoding) {
        switch((encoding + '').toLowerCase()) {
            case 'hex':
            case 'utf8':
            case 'utf-8':
            case 'ascii':
            case 'binary':
            case 'base64':
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
            case 'raw':
                return true;
            default:
                return false;
    };

    Buffer.concat = function(list, length) {
        if(!Array.isArray(list)) {
            throw new TypeError('Usage: Buffer.concat(list[, length])');
        }

        if(typeof length === 'undefined') {
            length = 0;
            for(var i = 0; i < list.length; i++) {
                length += list[i].length;
            }
        }
        else {
            length = ~~length;
        }

        if(length < 0) {
            length = 0;
        }

        if(list.length === 0) {
            return new Buffer(0);
        }
        else if(list.length === 1) {
            return list[0];
        }

        var buffer = new Buffer(length);
        var pos = 0;

        for(var i = 0; i < list.length; i++) {
            var buf = list[i];
            buf.copy(buffer, pos);
            pos += buf.length;
        }

        return buffer;
    };

    Buffer.byteLength = function (str, enc) {
        str = str + '';

        switch (enc) {
            case 'ucs2':
            case 'ucs-2':
            case 'utf16le':
            case 'utf-16le':
                return str.length * 2;
            case 'hex':
                return str.length >>> 1;
            default:
                return str.length;
        }
    };
};

});

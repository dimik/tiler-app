var Vow = require('vow'),
    inherit = require('inherit'),
    mongo = require('mongodb'),
    _extend = function (target, source) {
        var slice = Array.prototype.slice,
            hasOwnProperty = Object.prototype.hasOwnProperty;

        slice.call(arguments, 1).forEach(function (o) {
            for(var key in o) {
                hasOwnProperty.call(o, key) && (target[key] = o[key]);
            }
        });

        return target;
    };

/**
 * @fileOverview
 * MongoDB connector helper.
 */

/**
 * @class Mongo Database connector.
 * @name MongoConnector
 * @param {String} host MongoDB host.
 * @param {Number} port MongoDB port.
 * @param {Object} options MongoDB connection options.
 */
var MongoConnector = module.exports = inherit(/** @lends MongoConnector.prototype */{
    __constructor: function (host, port, options) {
        this._server = new mongo.Server(host, port, _extend({}, this.getDefaults(), options));
        this._dbs = {};
        this._db = null;
    },

    /**
     * Set active DataBase.
     * @function
     * @name MongoConnector.use
     * @param {String} name DataBase name.
     * @returns {Vow.promise} Promise A+
     */
    use: function (name) {
        var db = new MongoDB(name, this._server);

        return (this._dbs[name] = db).open();
    },

    getDefaults: function () {
        return {
            auto_reconnect: true
        };
    }
});

var MongoDB = inherit(/** @lends MongoDB.prototype */{

    __constructor: function (name, server) {
        this._name = name;
        this._server = server;
        this._db = null;
    },

    open: function () {
        if(this._db) {
            return Vow.resolve(this._db);
        }

        var defer = new Vow.Deferred();

        (new mongo.Db(this._name, this._server, { w: 1 })).open(function (err, db) {
            if(err) {
                defer.reject(err);
            }
            else {
                this._db = db;
                defer.resolve(this);
            }
        }.bind(this));

        return defer.promise();
    },

    getName: function () {
        return this._name;
    },

    getCollection: function (name) {
        var defer = new Vow.Deferred();

        this._db.collection(name, function (err, collection) {
            if(err) {
                defer.reject(err);
            }
            else {
                defer.resolve(collection);
            }
        });

        return defer.promise();
    },

    /**
     * Close database connection
     * @function
     * @name MongoConnector.close
     */
    close: function () {
        var promise = Vow.promise();

        this._db.close(function (err) {
            if(err) {
                promise.reject(err);
            }
            else {
                this._db = null;
                promise.resolve(true);
            }
        });

        return promise;
    }
});

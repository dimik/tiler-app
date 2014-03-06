var inherit = require('inherit'),
    Vow = require('vow'),
    ObjectID = require('mongodb').ObjectID;

/**
 * Base Model class.
 * For augment using only.
 * @class
 * @name MongoModel
 * @param {Object} collection Mongo collection.
 */
var MongoModel = module.exports = inherit(/** @lends MongoModel.prototype */{
    __constructor: function (collection) {
        this._collection = collection;
    },
    get: function (id) {
        var promise = Vow.promise();

        this._collection.findOne({ _id : new ObjectID(id) }, function (err, doc) {
            if(err) {
                promise.reject(err);
            }
            else {
                promise.fulfill(doc);
            }
        });

        return promise;
    },
    set: function (data) {
        var promise = Vow.promise();

        this._collection.insert(data, { safe : true }, function (err, doc) {
            if(err) {
                promise.reject(err);
            }
            else {
                promise.fulfill(doc._id);
            }
        });

        return promise;
    }
});

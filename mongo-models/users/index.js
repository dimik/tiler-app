/**
 * @fileOverview
 * Model for "users" collection for tiler database.
 */
var inherit = require('inherit'),
    BaseModel = require('..'),
    Vow = require('vow');

/**
 * Concrete model for tiler.users collection.
 * @class
 * @name UsersModel
 * @augments MongoModel
 * @param {Object} db Opened mongo database connection.
 */
var UsersModel = module.exports = inherit(BaseModel,/** @lends UsersModel.prototype */{
    createUser: function (name, userdata) {
        return this.set({ name: name, metadata: userdata });
    },
    getUserByToken: function (token) {
        var promise = Vow.promise();

        this._collection.findOne({
            credentials: {
                $elemMatch: {
                    token: token
                }
            }
        }, function (err, doc) {
            if(err) {
                promise.reject(err);
            }
            else {
                promise.fulfill(doc);
            }
        });

        return promise;
    },
});

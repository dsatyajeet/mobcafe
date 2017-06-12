/**
 * userItemService
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
/**
 * itemService
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
var User = require('../models/oauth/user');
var Item = require('../models/item');
var UserItem = require('../models/useritem');
var _ = require('lodash');

exports.buyItem = function (empCode, itemname,quantity, callback) {
    User.findOne({empCode: empCode},
        function (err, user) {
            if (err) {
                return callback(err);
            }
            else {
                if (!user) {
                    return callback(new Error('User not found'))
                }
                else {
                    Item.findOne({name: itemname}, function (errItem, item) {
                        if (errItem) {
                            return callback(errItem);
                        }
                        else {
                            if (!item) {
                                return callback(appError.ITEM_NOT_FOUND);
                            }
                            else {
                                var userItem = new UserItem();
                                userItem.user = user;
                                userItem.item = item;
                                userItem.quantity=quantity;
                                userItem.save(callback);
                            }
                        }
                    });
                }
            }
        }
    );
}

exports.getItemByUserId = function (userId, callback) {
    User.findById(userId, function (err, user) {
        if (err) {
            return callback(err);
        }
        else {
            if (!user) {
                return callback(new Error('User not found'));
            }
            else {
                UserItem.find({user: user}).populate('item').exec(callback);
            }
        }
    })
};



exports.getUserDueAmount = function (empCode, callback) {
    User.findOne({empCode: empCode},
        function (err, user) {
            if (err) {
                return callback(err);
            }
            else {
                if (!user) {
                    return callback(new Error('User not found'));
                }
                else {
                    UserItem.find({user: user}).populate('item').exec(function (err, useritems) {
                            if(err){
                                return callback(err);
                            }
                        else{
                              var dueAmount=  _.sumBy(useritems,function(useritem){
                                    return useritem.item.price;
                                });
                                return callback(null,dueAmount,user.firstname);
                            }
                    });
                }
            }
        }
    );

};



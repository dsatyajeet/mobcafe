/**
 * useritem
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

// Load required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Define our user schema
var UserItemSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref:'User'
    },
    item: {
        type: ObjectId,
        ref:'Item'
    },
    quantity:{
      type:Number,
        required:true
    },
    purchasedDate: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('UserItem', UserItemSchema);
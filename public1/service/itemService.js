/**
 * itemService
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
var Item = require('../models/item');
exports.addItem=function(name,price,callback){
    var item = new Item();

    item.name = name;
    item.price = price;

    // Save the client and check for errors
    item.save(callback);
}

exports.getAllItems=function(callback){
    Item.find({},callback);
}


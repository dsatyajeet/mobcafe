/**
 * item
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    price: {
        type: Number,
        require:true
    },
    description: {
        type: String
    },
    createDate: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Item', ItemSchema);

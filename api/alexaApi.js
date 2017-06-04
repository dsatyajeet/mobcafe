/**
 * alexaApi
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var userItemService = require('../service/userItemService')
var utilService = require('../service/utilService')


exports.buyItem = function (req, res) {
    userItemService.buyItem(req.user.empCode, req.body.item, req.body.quantity, function (err, data) {
        var msg = 'Transaction completed successfully';
        utilService.alexaEndBack(err, msg, req, res);
    });
}


exports.getMyDues = function (req, res) {
    userItemService.getUserDueAmount(req.user.empCode, function (err, amount) {
        var msg = 'Your due amount not found';
        if (!err && amount) {
            msg = 'Your due amount is ' + amount + ' rupees only.';
        }
        utilService.alexaEndBack(err, msg, req, res);
    });
}

exports.getUserDues = function (req, res) {
    console.log('EMP DUE CODE: '+req.params.empCode);
    userItemService.getUserDueAmount(req.params.empCode, function (err, amount, username) {
        var msg = 'User due amount not found';
        if (!err && amount && username) {
            msg = username + '\'s due amount is ' + amount + ' rupees only.';
            ;
        }
        utilService.alexaEndBack(err, msg, req, res);
    });
}

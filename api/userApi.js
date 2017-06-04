/**
 * userApi
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var userItemService = require('../service/userItemService')
var userService = require('../service/userService')
var utilService = require('../service/utilService')

exports.getMyItems = function (req, res) {
    userItemService.getItemByUserId(req.user._id, function (err, data) {
        utilService.endBack_MC(err, data, req, res);
    });
}

exports.buyItem = function (req, res) {
    userItemService.buyItem(req.user.empCode,req.body.quantity, function (err, data) {
        utilService.endBack_MC(err, data, req, res);
    });
}


exports.getMyDues = function (req, res) {
    userItemService.getUserDueAmount(req.user.empCode, function (err, data) {
        utilService.endBack_MC(err, data, req, res);
    });
}

exports.getUserDues = function (req, res) {
    userItemService.getUserDueAmount(req.param.empCode, function (err, data) {
        utilService.endBack_MC(err, data, req, res);
    });
}

exports.getUserList = function (req, res) {
    userService.getAllUser_MC(function (err, data) {
        utilService.endBack_MC(err, data, req, res);
    });
}

exports.getUserById = function (req, res) {
    userService.getById_MC(req.param('userId'), function (err, data) {
        utilService.endBack_MC(err, data, req, res)
    });
}

exports.registerUser = function (req, res) {
    userService.register(req.body.password, req.body.email, req.body.empCode,
        req.body.firstname, req.body.lastname, req.body.mobile, req.body.confirmPassword,function (err, data) {
            utilService.endBack_MC(err, data, req, res)
        });
}


exports.addUser = function (req, res) {
    var roleArray = req.body.roles.split(',');
    userService.add_MC(req.body.username, req.body.password, req.body.email, req.body.empCode,
        req.body.firstname, req.body.lastname, req.body.mobile, roleArray, function (err, data) {
            utilService.endBack_MC(err, data, req, res)
        });
}

exports.updateUser = function (req, res) {
    var roleArray = req.body.roles.split(',');
    userService.update2(req.body.userId, req.body.username, req.body.email, req.body.empCode,
        req.body.firstname, req.body.lastname, req.body.mobile, roleArray, function (err, data) {
            utilService.endBack_MC(err, data, req, res)
        });
}
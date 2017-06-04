/**
 * item
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var express = require('express');
var router = express.Router();
var itemApi = require('../api/itemApi');
var oauth2 = require('../oauth/oauth2');

router.get('/getAll',oauth2.isLoggedIn, function (req, res, next) {
    itemApi.getAllItems(req,res);
});

module.exports = router;
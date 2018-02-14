/**
 * twoStepAuth
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */


var express = require('express');
var router = express.Router();
var twoStepAuthApi = require('../api/twoStepAuthApi');
var utilService = require('../service/utilService');
var oauth2 = require('../oauth/oauth2');


router.get('/getNewSecret',oauth2.isLoggedIn, function (req, res, next) {
    twoStepAuthApi.getNewSecret(req,res);
});

router.post('/enable2fa',oauth2.isLoggedIn, function (req, res, next) {
    twoStepAuthApi.enable2fa(req,res);
});

router.post('/verifyToken',oauth2.isLoggedIn, function (req, res, next) {
    twoStepAuthApi.verifyToken(req,res);
});

router.put('/disable2fa',oauth2.isLoggedIn, function (req, res, next) {
    twoStepAuthApi.disable2fa(req,res);
});

module.exports = router;
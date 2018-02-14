/**
 * alexa
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var utilService = require('../service/utilService');
var alexaApi = require('../api/alexaApi');
var async = require('async');
var qr = require('qr-image');
var oauth2 = require('../oauth/oauth2');
var authoriseAlexa = utilService.alexa_authoriseUser
var twoFA_authenticate = utilService.alexa_AuthenticateUserUtil


router.post('/buyItem', twoFA_authenticate(), function (req, res, next) {
    alexaApi.buyItem(req, res);
});

router.get('/myDue',twoFA_authenticate(), function (req, res, next) {
    alexaApi.getMyDues(req, res);
});

router.get('/userDue/:empCode', twoFA_authenticate(),authoriseAlexa(['Admin']), function (req, res, next) {
    alexaApi.getUserDues(req, res);
});

module.exports = router;

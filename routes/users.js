var express = require('express');
var router = express.Router();
var userService = require('../service/userService');
var utilService = require('../service/utilService');
var userApi = require('../api/userApi');
var async = require('async');
var qr = require('qr-image');
var oauth2 = require('../oauth/oauth2');
var authorise = utilService.authoriseUser
var authenticate = utilService.authenticateUserUtil


router.get('/myItems', oauth2.isLoggedIn, function (req, res, next) {
    userApi.getMyItems(req, res);
});

router.get('/myDue', oauth2.isLoggedIn, function (req, res, next) {
    userApi.getMyDues(req, res);
});

router.get('/userDue', oauth2.isLoggedIn, function (req, res, next) {
    userApi.getUserDues(req, res);
});

router.get('/user/:userId', function (req, res, next) {
    userApi.getUserById(req, res);
});

/*My profile*/
router.get('/myProfile', authenticate(), function (req, res, next) {
    res.json(req.user);
});


router.get('/qrCode', function (req, res) {
    var code = qr.image(req.query.qrUrl, {type: 'png'});
    res.type('png');
    code.pipe(res);
});


/*
 Returns all users.
 */
router.get('/list', authenticate(), authorise(['Admin', 'Customer']), function (req, res, next) {
    userApi.getUserList(req, res);
});


/* Add User. */
router.route('/add').post(oauth2.isLoggedIn, authorise(['Admin', 'Customer']), function (req, res, next) {
    userApi.addUser(req, res);
});


/* Register User. */
router.route('/register').post(function (req, res, next) {
    userApi.registerUser(req, res);
});


/* Add User. */
router.route('/update').post(oauth2.isLoggedIn, function (req, res, next) {
    userApi.updateUser(req, res);
});


router.route('/oauth/token')
    .post(oauth2.isAuthenticated, oauth2.token2);


module.exports = router;

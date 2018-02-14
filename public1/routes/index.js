var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('loginindex', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
  res.render('index-trial', { title: 'Express' });
});

router.get('/gok', function(req, res, next) {
  res.render('hello_g_user', { title: 'Express' });
});


router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Express' });
});


/* GET home page. */
router.get('/profile', function(req, res, next) {
  res.render('profile-page', { title: 'Express' });
});

router.get('/env', function(req, res, next) {
  res.json(envConf)
});
router.get('/envUrl', function(req, res, next) {
  res.json(envConf.serverUrl)
});


module.exports = router;

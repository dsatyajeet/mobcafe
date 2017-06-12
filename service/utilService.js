var userService = require('./userService')
var GoogleStrategy   = require( 'passport-google-oauth2' ).Strategy;

exports.endBack_MC = function ( err, result, req, res) {
    if (err) {
        renderError(err, req, res);
    }
    else {
        var data={result:result}
        res.json(data);
    }
}

exports.alexaEndBack = function ( err, successMessage, req, res) {
    if (err) {
        console.log('error found: '+JSON.stringify(err));
        if(err.errorCode){
            res.status=500;
            res.json(err);
        }
        else{
            res.status=500;
            res.json(appError.RUNTIME_ERROR);
        }
    }
    else {
        res.status=200;
        var data={message:successMessage}
        res.json(data);
    }
}

exports.authenticateUserUtil=function(){
    return function(req,res,next){
        userService.authenticateUser_MC(req.header('Authorization').split(' ')[1],function(err,user){
            if (err) {
                renderError(err,req, res);
            }
            else {
                req.user=user
                if(next)
                    next(null);
            }
        })
    }
}

exports.alexa_AuthenticateUserUtil=function(){
    return function(req,res,next){
        var authString=req.header('Authorization').split(' ')[1];
        var authCredentials=authString.split(':');
        userService.authenticateBy2FA(authCredentials[0],authCredentials[1],function(err,user){
            if (err) {
                alexaError(err,req, res);
            }
            else {
                req.user=user
                if(next)
                    next(null);
            }
        });
    }
}

exports.authoriseUser=function(roles){
    return function(req,res,next){
        userService.authoriseUser_MC(req.user._id,roles,function(err,user){
            if (err) {
                renderError(err,req, res);
            }
            else {
                req.user=user
                if(next)
                    next(null);
            }
        })
    }
}

exports.alexa_authoriseUser=function(roles){
    return function(req,res,next){
        userService.authoriseUser_MC(req.user._id,roles,function(err){
            if (err) {
                alexaError(err,req,res);
            }
            else {
                if(next)
                    next(null);
            }
        })
    }
}


function renderError(err, req, res, next) {
    console.log('custom error..utilservice' + err);
    res.status(err.status || 500);
    res.json({errorMessage: err.message});
}

function alexaError(err, req, res, next) {
    console.log('custom error..alexa ' + JSON.stringify(err));
    if(err.errorCode){
        res.status(500);
        res.json(err);
    }
    else{
        var message='Unknown error';
        var errorCode=500;
        res.status(500);
        res.json({errorCode:errorCode,message: message});
    }
}


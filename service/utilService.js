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
        res.status=500;
        res.json({message:'Sorry, something went wrong.'});
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
                if(err.message && err.message=='Access denied'){
                       err=403;
                }
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
    console.log('custom error..alex' + err);
    var message='Unknown error';
    var errorCode=500;
    if((err==401)||(err==403)||(err==9001)){
        errorCode=err;
        switch(err){
            case 401:{
                message='Authentication failed, Please try again.';
                break;
            }
            case 403:{
                message='You are not authorised to get these details';
                break;
            }
            case 9001:{
                message='Please enable 2 factor authentication from the portal.';
                break;
            }
        }
    }
    res.status(500);
    res.json({errorCode:errorCode,errorMessage: message});
}


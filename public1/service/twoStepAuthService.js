/**
 * twoStepAuthService
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var User = require('../models/oauth/user');
var speakeasy = require('speakeasy');
var QRCode = require('qrcode');


exports.getQRUrl=function(callback,context){
    QRCode.toDataURL(secret.otpauth_url, function(err, data_url) {
        console.log(data_url); // get QR code data URL
        if (err) {
            console.log('user get by id: '+err);
            return callback(context, err);
        }
        else {
            if (!data_url) {
                return callback(context, new Error('data_url not found'));
            }
            else{
                return callback(context, null, data_url);
            }
        }
    });
}

exports.getNewSecret = function (user, callback) {
    var locals={active2fa:false};
    if(!user.text2fa){
        var twoFAName='MobCafe ('+user.empCode+')';
        var secret = speakeasy.generateSecret({length: 20,name:twoFAName});
        console.log(secret.base32); // secret of length 20
        var encodedUri=encodeURIComponent(secret.otpauth_url);
        locals.qrPath = '/qrCode?qrUrl=' + encodedUri;
        locals.otpAuthUrl=encodedUri;
        // Get initial token
        locals.token = getToken(secret.base32)
        locals.secret=secret.base32;
        return callback(null,locals);
    }
    else{
        locals.active2fa=true;
        return callback(null,locals);
    }
};

exports.verifyToken = function (secret, token) {
    return speakeasy.time.verify({secret: secret, encoding: 'base32', token: token});
};

exports.enable2fa = function (id,secret, token,callback) {
    var is2faVerified= exports.verifyToken(secret,token);
    if(is2faVerified){
        update2fa(id,secret,function(err,user){
            if(err){
                return callback(err);
            }
            else{
                return callback(null,true);
            }
        });
    }
    else{
        return callback(new Error('2fa verification failed.'));
    }
};

exports.disable2fa = function (id,callback) {
    User.findByIdAndUpdate(id,{text2fa:undefined},callback)
};

function update2fa(id, text2fa,callback) {
    User.findById(id, function(err,user){
        if(err){
            return callback(err)
        }
        else{
            if(user.text2fa){
                return callback(new Error('User 2fa already enabled'))
            }
            else{
                User.findByIdAndUpdate(id,{text2fa:text2fa},callback)
            }
        }
    });
}

function getToken(secret) {
    return speakeasy.time({secret: secret, encoding: 'base32'})
}

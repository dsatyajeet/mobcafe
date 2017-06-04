var User = require('../models/oauth/user');
var Role = require('../models/oauth/role');
var AccessToken = require('../models/oauth/accesstoken');
var RoleService = require('./roleService');
var utils = require('../util');
var async = require('async');

var speakeasy = require('speakeasy');
var QRCode = require('qrcode');


exports.getQRUrl = function (callback, context) {
    QRCode.toDataURL(secret.otpauth_url, function (err, data_url) {
        console.log(data_url); // get QR code data URL
        if (err) {
            console.log('user get by id: ' + err);
            return callback(context, err);
        }
        else {
            if (!data_url) {
                return callback(context, new Error('data_url not found'));
            }
            else {
                return callback(context, null, data_url);
            }
        }
    });
}

exports.getNewSecret = function (user, callback) {
    var locals = {active2fa: false};
    if (!user.text2fa) {
        var secret = speakeasy.generateSecret({length: 20});
        console.log(secret.base32); // secret of length 20
        var encodedUri = encodeURIComponent(secret.otpauth_url);
        locals.qrPath = '/qrCode?qrUrl=' + encodedUri;
        locals.otpAuthUrl = encodedUri;
        // Get initial token
        locals.token = getToken(secret.base32)
        locals.secret = secret.base32;
        return callback(null, locals);
    }
    else {
        locals.active2fa = true;
        return callback(null, locals);
    }
};

exports.verifyToken = function (secret, token) {
    return speakeasy.time.verify({secret: secret, encoding: 'base32', token: token});
};


exports.enable2fa = function (id, secret, token, callback) {
    var is2faVerified = exports.verifyToken(secret, token);
    if (is2faVerified) {
        update2fa(id, secret, function (err, user) {
            if (err) {
                return callback(err);
            }
            else {
                return callback(null, true);
                /*User.findByIdAndUpdate(id,{
                 text2fa:secret
                 },callback)*/
            }
        });
    }
    else {
        return callback(new Error('2fa already enabled.'));
    }
};

exports.disable2fa = function (id, callback) {
    User.findByIdAndUpdate(id, {text2fa: undefined}, callback)
};

function update2fa(id, text2fa, callback) {
    User.findById(id, function (err, user) {
        if (err) {
            return callback(err)
        }
        else {
            if (user.text2fa) {
                return callback(new Error('User 2fa already enabled'))
            }
            else {
                User.findByIdAndUpdate(id, {text2fa: text2fa}, callback)
            }
        }
    });
}


function getToken(secret) {
    return speakeasy.time({secret: secret, encoding: 'base32'})
}

exports.getUserByToken = function (token, callback, context) {
    console.log('get user by token:cc ' + token);
    AccessToken.findOne({value: token}, function (err, accessToken) {
        if (err) {
            return callback(context, err);
        }
        if (!(accessToken && accessToken.userId)) {
            return callback(context, new Error('Access token not found.'));
        }
        User.findById(accessToken.userId).populate('roles').exec(err, function (err, loadedUser) {
            if (!loadedUser) {
                return callback(context, new Error('User not found.'));
            }
            console.log('user found and context is: ' + context);
            return callback(context, null, loadedUser);
        });

    });
};

exports.authenticateUser_MC = function (token, callback) {
    AccessToken.findOne({value: token}, function (err, accessToken) {
        if (err) {
            return callback(err);
        }
        if (!(accessToken && accessToken.userId)) {
            return callback(new Error('Access token not found.'));
        }
        User.findById(accessToken.userId).populate('roles').exec(err, function (err, loadedUser) {
            if (!loadedUser) {
                return callback(new Error('User not found.'));
            }
            return callback(null, loadedUser);
        });
    });
};

exports.authenticateBy2FA = function (empCode,twoFAPin, callback) {
    exports.getUserByEmpCode(empCode,function(err,user){
        if(err){
            return callback(err);
        }
        else{
            if(!user.text2fa){
                return callback(9001);
            }
            else{
                var isValidUser=exports.verifyToken(user.text2fa,twoFAPin);
                if(isValidUser || true){
                    return callback(null,user);
                }
                else{
                    return callback(401);
                }

            }
        }
    });
};


exports.authoriseUser_MC = function (userId, roles, callback) {
    User.findById(userId).populate({
        path: 'roles',
        match: {"name": {"$in": roles}}
    }).exec(function (err, userRoles) {
        if (!(userRoles && userRoles.roles && userRoles.roles.length > 0)) {
            return callback(new Error('Access denied'));
        }
        else {
            return callback();
        }
    });
};


exports.add_MC = function (username, password, email, empCode, firstname, lastname, mobile, roleArray, callback) {
    RoleService.getRoles(roleArray, function (err, selectedRoles) {
        addUser_local(username, password, email, empCode, firstname, lastname, mobile, selectedRoles, callback);
    });
};


exports.register = function (password, email, empCode, firstname, lastname, mobile, confirmPassword,callback) {
        if (password != confirmPassword) {
            return callback(new Error('Password -confirm password not match.'))
        } else {
            RoleService.getRoles(['Customer'],function(err,roles){
                if(err){
                    return callback(err);
                }
                else{
                    addUser_local(email, password, email, empCode, firstname, lastname, mobile,roles,callback);
                }
            });
        }
};

exports.update2 = function (id, username, email, empCode, firstname, lastname, mobile, roleArray,callback) {
    RoleService.getRoles(roleArray, function (err, roles) {
        if (err) {
            return callback(err);
        }
        else {
            updateUser_local(id, username, email, empCode, firstname, lastname, mobile,
                roles, callback);
        }
    });
};

exports.getAllUser_MC = function (callback) {
    User.find({}).populate('roles').exec(function (err, found) {
        if (err) {
            console.log('error in finding/populating all users:' + err);
            return callback(err);
        }
        else {
            if (!found) {
                return callback(new Error('Undefined user list after role population.'));
            }
            else {
                return callback(null, found);
            }
        }
    });
};

exports.getById_MC = function (userId, callback) {
    console.log('user get by idd:' + userId);
    User.findOne({_id: userId}).populate('roles').exec(function (err, user) {
        if (err) {
            console.log('user get by id: ' + err);
            return callback(err);
        }
        else {
            if (!user) {
                return callback(new Error('User not found'));
            }
            else {
                return callback(null, user);
            }
        }
    });
};

exports.getUserByEmpCode = function (empCode, callback) {

    User.findOne({empCode: empCode}).populate('roles').exec(function (err, user) {
        if (err) {
            console.log('user get by empCode: ' + err);
            return callback(err);
        }
        else {
            if (!user) {
                return callback(new Error('User not found'));
            }
            else {
                return callback(null, user);
            }
        }
    });
};



exports.authGoogleUser = function (password, email, empCode, firstname, lastname, mobile,callback) {
    getUserByName_local_MC(email,function(err,existingUser){
        if(err){
            return callback(err);
        }
        else{
            if(!existingUser){
                RoleService.getRoles(['Customer'],function(err,roles){
                    if(err){
                        return callback(err);
                    }
                    else{
                        addUser_local(email, password, email, empCode, firstname, lastname, mobile,roles,function(err,user){
                            if(err){
                                return callback(err);
                            }
                            else{
                                getOrGenerateAccessToken_local_MC(user._id,callback);
                            }
                        });
                    }
                });

            }
            else{
                getOrGenerateAccessToken_local_MC(existingUser._id,callback);
            }
        }
    });
};



function addUser_local(username, password, email, empCode, firstName, lastName, mobile, roles, callback) {
    var userObj = {
        username: username,
        password: password,
        email: email,
        empCode: empCode,
        firstname: firstName,
        lastname: lastName,
        mobile: mobile
    };
    if (roles) {
        userObj.roles = roles;
    }
    var user = new User(userObj);
    user.save(function (err) {
        if (err) {
            console.error('error in adding user: ' + err);
            callback(err);
        }
        else {
            console.log('user added:' + user);
            callback(null, user);
        }
    });
}


function updateUser_local(id, username, email, empCode, firstname, lastname, mobile, roles, callback) {
    User.findByIdAndUpdate(id, {
        username: username,
        email: email,
        empCode: empCode,
        firstname: firstname,
        lastname: lastname,
        mobile: mobile,
        roles: roles
    }, function (err, userUpdated) {
        console.log('update status: ' + err + '    update user: ' + userUpdated);
        if (err) {
            return callback(err);
        }
        else {
            User.findById(id, function (err, found) {
                if (err) {
                    return callback(err);
                }
                else {
                    return callback(null, found);
                }

            })
        }
    });
}


function getUserByName_local(callback, context, username) {
    User.findOne({username: username}).populate('roles').exec(function (err, found) {
        if (err) {
            return callback(context, err);
        }
        else {
            console.log('user found..');
            return callback(context, null, found);
        }
    });

}

function getUserByName_local_MC(username,callback) {
    User.findOne({username: username}).populate('roles').exec(callback);

}

function getOrGenerateAccessToken_local(callback, context, userId) {
    AccessToken.findOne({userId: userId}, function (err, existingToken) {
        if (err) {
            return callback(context, err);
        }
        if (!existingToken) {
            console.log('creating new token');
            var token = utils.uid(50);
            var accessToken = new AccessToken();
            accessToken.value = token;
            accessToken.userId = userId;
            accessToken.save(function (err) {
                if (err) {
                    return callback(context, err);
                }
                return callback(context, null, accessToken);
            });
        }
        else {
            return callback(context, null, existingToken);
        }
    });
}


function getOrGenerateAccessToken_local_MC(userId,callback) {
    AccessToken.findOne({userId: userId}, function (err, existingToken) {
        if (err) {
            return callback(err);
        }
        if (!existingToken) {
            console.log('creating new token');
            var token = utils.uid(50);
            var accessToken = new AccessToken();
            accessToken.value = token;
            accessToken.userId = userId;
            accessToken.save(function (err) {
                if (err) {
                    return callback(err);
                }
                else{
                    return callback(null,accessToken);
                }
            });
        }
        else {
            return callback(null, existingToken);
        }
    });
}
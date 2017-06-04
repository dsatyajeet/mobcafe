var mongoose=require('mongoose');
var Role=require('../models/oauth/role');

exports.getRoles=function(roleArray,callback) {
    Role.find()
        .where('name')
        .in(roleArray)
        .exec(function (err, roles) {
            if (err) {
                console.error('error in finding roles.');
                return callback(err);
            }
            else {
                console.log(' record found ' + roles);
                console.log('total records: ' + roles.length);
                return callback(null,roles);
            }
        });

}
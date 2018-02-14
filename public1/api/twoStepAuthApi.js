/**
 * twoStepAuthApi
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var twoStepAuthService=require('../service/twoStepAuthService')
var utilService=require('../service/utilService')

exports.getNewSecret=function(req,res){
    twoStepAuthService.getNewSecret(req.user,function(err,data){
        utilService.endBack_MC(err,data,req,res);
    })
}

exports.enable2fa=function(req,res){
    twoStepAuthService.enable2fa(req.user._id,req.body.secret,req.body.token,function(err,data){
        return utilService.endBack_MC(err,data,req,res);
    });
}

exports.disable2fa=function(req,res){
    twoStepAuthService.disable2fa(req.user._id,function(err,data){
        return utilService.endBack_MC(err,data,req,res);
    });
}


exports.verifyToken=function(req,res){
    var result=twoStepAuthService.verifyToken(req.user.text2fa,req.body.token);
    var data={result : result}
    utilService.endBack_MC(null,data,req,res);
}
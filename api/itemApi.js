/**
 * itemApi
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
/**
 * twoStepAuthApi
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var itemService=require('../service/itemService')
var utilService=require('../service/utilService')

exports.getAllItems=function(req,res){
    itemService.getAllItems(function(err,data){
        utilService.endBack_MC(err,data,req,res);
    });
}
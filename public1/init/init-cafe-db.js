/**
 * init-cafe-db
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mobcafe');

var itemService = require('../service/itemService');
var userItemService = require('../service/userItemService');

//addUserItem('sdeshmukh@mobiquityinc.com','Lays');
addItem('Kurkure',15);
addItem('Lays',20);
addItem('Haldiram sev',10);
addItem('Haldiram sev',10);
addItem('Lassi',10);



//getSum(1234);

function addItem(name,price){
    itemService.addItem(name,price,function(err,item){
        console.log('err:'+err)
        console.log('item:'+item)
    })
}

function addUserItem(email,itemName){
userItemService.addUserItem(email,itemName,function(err,useritem){
    console.log('err:'+err)
    console.log('item:'+useritem)
})
}

function getSum(empCode){
    userItemService.getUserDueAmount(empCode,function(err,sum){
        console.log('err:'+err);
        console.log('sum:'+sum);
    })
}
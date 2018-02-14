/**
 * errorCodes
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */
var errorCodes={
    ITEM_NOT_FOUND:{
        errorCode: 9000, message:'Sorry could not complete the request, Requested item not found.',
    },
    TWO_FA_AUTH_FAILED:{
        errorCode: 9001, message:'Authentication failed, kindly provide the correct id and 2fa password',
    },
    RUNTIME_ERROR:{
        errorCode: 9003, message:'Sorry could not proceed the request.',
    },
    TWO_FA_NOT_ENABLED:{
        errorCode:9004, message:'Please enable 2 factor authentication from the portal.'
    },
    USER_CODE_NOT_FOUND:{
        errorCode:9005, message:'Authentication failed, Sorry, Requested user of id not found.'
    },
    ACCESS_DENIED:{
        errorCode:9006,message:'You are not authorised to get these details.'
    }
};

module.exports=errorCodes;
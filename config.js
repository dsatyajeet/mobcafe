/**
 * config.js
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var env = process.env.NODE_ENV || 'local';

//-----------------------------------------------------------------------------

var config = {
    local: {
        basePath: 'localhost'
        , protocol:'http://'
        , port: 4000
        , app: {
            name: 'MOB-CAFE [LOCAL]',
            env_name: 'local'
        }
    },
    development: {
        basePath: 'localhost'
        , protocol:'http://'
        , port: 4000
        , app: {
            name: 'MOB-CAFE [LOCAL]',
            env_name: 'local'
        }
    }
};

global.patchNumber = 2;
global.daysToComplete = 30;
global.removeExpiredReadings = true;

//set api version
config[env].apiVersion = '1.0';

// setup route paths
config[env].envUrl = config[env].protocol+config[env].basePath+':'+config[env].port;
module.exports = config[env];


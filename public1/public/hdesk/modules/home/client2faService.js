/**
 * client2faService
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var mainApp = angular.module("HDHome");
mainApp
    .factory('HD2FAService', ['$http', '$cookieStore','$rootScope', function ($http, $cookieStore,$rootScope) {
        var service = {};
        var config = $rootScope.appConfig;
        service.myNewSecret=function(){
            console.log('in my myNewSecret..x');
            return $http.get('twoStepAuth/getNewSecret',config);
        };

        service.getQRImage=function(qrString){
            config.params={qrUrl: qrString}
            return $http.get('twoStepAuth/qrCode',config);
        };

        service.enable2fa = function (tokenData) {
            console.log('add token: '+$cookieStore.get('globals').currentUser.authdata);
            return $http.post('twoStepAuth/enable2fa', tokenData, $rootScope.appConfig);
        }

        service.disable2fa = function () {
            var data={}
            console.log('add token: '+$cookieStore.get('globals').currentUser.authdata);
            return $http.put('twoStepAuth/disable2fa', data, $rootScope.appConfig);
        }

        service.verifyToken = function (tokenData) {
            console.log('add token: '+$cookieStore.get('globals').currentUser.authdata);
            return $http.post('twoStepAuth/verifyToken', tokenData, $rootScope.appConfig);
        }
        service.getEnvUrl=function(){
            return $http.get(('/envUrl'));
        }

        return service;
    }]);



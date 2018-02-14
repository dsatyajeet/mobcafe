/**
 * clientItemService
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var mainApp = angular.module("HDHome");
mainApp
    .factory('MCFItemService', ['$http', '$cookieStore','$rootScope', function ($http, $cookieStore,$rootScope) {
        var service = {};
        var config = $rootScope.appConfig;
        service.getAll=function(){
            return $http.get('item/getAll',config);
        };
        service.getMyItems=function(){
            return $http.get('users/myItems',config);
        };
        service.getMyDue=function(){
            return $http.get('users/myDue',config);
        };
        return service;
    }]);



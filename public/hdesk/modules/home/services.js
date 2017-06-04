'use strict'
angular.module('HDHome')
    .factory('HDHomeService', ['$http', '$cookieStore', '$rootScope','$window', function ($http, $cookieStore, $rootScope,$window) {
        console.log('global cookie: '+$cookieStore.get('globals'));
        var service={};
        var config={};

        service.logout = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
            $http.get(('/envUrl')).success(function(envUrl){
                $window.location.href =envUrl;
            });
        };

        if($cookieStore.get('globals')) {
            config = {
                headers: {
                    'Authorization': 'Basic ' + $cookieStore.get('globals').currentUser.authdata,
                    'Accept': 'application/json;'
                }
            };
        }

        service.myProfile=function(){
            return $http.get('users/myProfile',config);
        };

        return service;
    }]);
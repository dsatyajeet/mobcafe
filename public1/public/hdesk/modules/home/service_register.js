'use strict'

angular.module('HDRegistration')
    .factory('RegisterService', ['$http', function ($http) {
        var service = {};
        service.register = function (userData) {
            return $http.post('users/register', userData);
        }
        service.getEnvUrl=function(){
            return $http.get(('/envUrl'));
        }

        return service;
    }]);
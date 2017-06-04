'use strict';

angular.module('HDAuthentication')

    .factory('HDAuthenticationService',
    [ '$http', '$cookieStore', '$rootScope', '$timeout',
        function ( $http, $cookieStore, $rootScope, $timeout) {
            var service = {};
            var config = {
                headers: {
                    'Authorization': 'Basic aWhlbHA6aXNlY3JldA==',
                    'Accept': 'application/json;'
                }
            };

            service.Login = function (username, password, callback) {
                var userData = {};
                userData.username = username;
                userData.password = password;
                userData.grant_type = 'password';
            return $http.post('/users/oauth/token', userData, config);
            };

            service.SetToken = function (username,token) {

                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        authdata: token
                    }
                };
                $cookieStore.put('globals', $rootScope.globals);
            };

            service.ClearCredentials = function () {
                $rootScope.globals = {};
                $cookieStore.remove('globals');
            };
            
            service.getEnvUrl=function(){
                return $http.get(('/envUrl'));
            }

            return service;
        }]);
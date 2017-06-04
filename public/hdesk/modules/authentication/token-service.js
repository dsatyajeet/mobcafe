
'use strict';

angular.module('HDGoogleAuth')

    .factory('HDTokenService',
    [ '$http', '$cookieStore', '$rootScope',
        function ( $http, $cookieStore, $rootScope) {
            var service = {};
            service.SetToken = function (username,token) {

                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        authdata: token
                    }
                };
                $cookieStore.put('globals', $rootScope.globals);
            };
            service.getToken=function(query){
                return $http.get(('/api/auth/google/callback?'+query));
            }
            service.getEnvUrl=function(){
                return $http.get(('/envUrl'));
            }
            return service;
        }]);

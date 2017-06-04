'use strict';

angular.module('HDGoogleAuth',['ngRoute', 'ngCookies'])

    .controller('HDGoogleAuthController',
    ['$scope', '$rootScope', '$location', '$window','$cookieStore','$http','HDTokenService',
        function ($scope, $rootScope, $location, $window,$cookieStore,$http, HDTokenService) {
            // reset login status
            console.log('in ng controller..##'+$location.url());
            var query=$location.absUrl().split('?')[1];
            console.log('THE QUERY: '+query);
            HDTokenService.getToken(query).success(function(response){
                HDTokenService.SetToken(response.email,response.hd_map_token);

                HDTokenService.getEnvUrl().success(function(envUrl){
                    console.log('google-success-callback2');
                    $window.location.href=envUrl+"/home"
                });

            }).error(function(err){
                console.error('GERROR: '+err);
            });

        }]);
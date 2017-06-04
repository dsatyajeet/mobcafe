'use strict';

angular.module('HDRegistration',['ngRoute', 'ngCookies'])

    .controller('RegisterController',
    ['$scope', '$rootScope', '$location', '$window','$cookieStore','$http','RegisterService',
        function ($scope, $rootScope, $location, $window,$cookieStore,$http, RegisterService) {
            $scope.register_flag=false;
            $scope.resData={};
            if ($rootScope.globals && $rootScope.globals.currentUser) {
                RegisterService.getEnvUrl().success(function(envUrl){
                    console.log('register-success-callback2');
                    $window.location.href=envUrl+"/home"
                });
            }

            //HDAuthenticationService.ClearCredentials();
            $scope.register = function () {
                RegisterService.register($scope.resData).success(function (data) {
                    $scope.register_flag=true;
                    $scope.error_flag=false;
                    console.log("registration succeeded.");
                }).error(function (response) {
                    $scope.error_flag=true;
                    $scope.error_message=response;
                    console.log("registration failed.");
                });
            };
        }]);


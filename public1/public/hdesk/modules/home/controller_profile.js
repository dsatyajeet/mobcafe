
var mainApp = angular.module("HDHome");

mainApp.controller('ProfileController', ['$scope', '$rootScope', '$location', '$routeParams', 'HDUserService', 'HDUtilService', 'HDHomeService',
    function ($scope, $rootScope, $location, $routeParams, HDUserService, HDUtilService, HDHomeService) {
        console.log('Current Location:::' + $location.path());
        $scope.resData = {};



        HDHomeService.myProfile().then(function successCallback(resData) {
                $scope.resData = resData.data;

        }, function errorCallback(resData) {
            console.log('user view failed..' + resData);
        });
    }]);



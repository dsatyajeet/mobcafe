/**
 * controller_2fa
 *
 * @description:
 * @author: Satyajeet Deshmukh <sdeshmukh@mobiquityinc.com>
 */

var mainApp = angular.module("HDHome");

mainApp.controller('2FAController', ['$route','$scope', '$rootScope', '$location', '$routeParams', 'HD2FAService', 'HDUtilService', 'HDHomeService',
    function ($route,$scope, $rootScope, $location, $routeParams, HD2FAService, HDUtilService, HDHomeService) {
        console.log('Current Location:::' + $location.path());
        $rootScope.resetMessagePoint();
        $scope.resData = {};
        HD2FAService.myNewSecret().then(function successCallback(resData) {
            HD2FAService.getEnvUrl().success(function(envUrl){
                $scope.resData = resData.data.result;
                $scope.resData.envUrl=envUrl;
                console.log('user 2fa envUrl..' + envUrl);
            });

        }, function errorCallback(resData) {
            console.log('user 2fa failed..' + resData);
        });

        $scope.enable2fa = function () {
            console.log('hello..token');
            $rootScope.resetMessagePoint();
            HD2FAService.enable2fa($scope.resData).success(function (resData) {
                console.log('token verified successfully..' + resData.result);
                $route.reload()
                // $location.path('/set2fa2');
            }).error(function (resData) {
                $rootScope.formErrorMessagePoint(404, resData.errorMessage);
                console.log('user added failed..' + resData);
            });
        }


        $scope.disable2fa = function () {
            console.log('hello..token');
            $rootScope.resetMessagePoint();
            HD2FAService.disable2fa($scope.resData).success(function (resData) {
                console.log('2fa disabled successfully..' + resData.result);
                $route.reload()
                // $location.path('/set2fa2');
            }).error(function (resData) {
                $rootScope.formErrorMessagePoint(404, resData.errorMessage);
                console.log('error in 2fa disabled ' + resData);
            });
        }


        $scope.verifyToken = function () {
            console.log('hello..token');
            $rootScope.resetMessagePoint();
            HD2FAService.verifyToken($scope.resData).success(function (resData) {
                console.log('token verified successfully..' + resData.result.result);
                if(resData.result.result){
                    $rootScope.formSuccessMessagePoint(200, 'Token verified successfully');
                }
                else{
                    $rootScope.formErrorMessagePoint(404, 'Invalid token found');
                }

                // $location.path('/set2fa2');
            }).error(function (resData) {
                $rootScope.formErrorMessagePoint(404, 'Error occured');
                console.log('user added failed..' + resData);
            });
        }
    }]);


mainApp.controller('ItemListController', ['$scope', 'MCFItemService', function ($scope, MCFItemService) {
    MCFItemService.getAll().success(function (result) {
        $scope.itemList = result.result;
    }).error(function (errResponse) {
        console.log('error to view itemList: ' + errResponse);
    });
}]);

mainApp.controller('MyItemListController', ['$scope', 'MCFItemService', function ($scope, MCFItemService) {
    MCFItemService.getMyItems().success(function (result) {
        $scope.itemList = result.result;
    }).error(function (errResponse) {
        console.log('error to view itemList: ' + errResponse);
    });
    MCFItemService.getMyDue().success(function (result) {
        $scope.myDue = result.result;
    }).error(function (errResponse) {
        console.log('error to view my-due: ' + errResponse);
    });
}]);




mainApp.controller('QRController', ['$scope', '$rootScope', '$location', '$routeParams', 'HD2FAService', 'HDUtilService',
    function ($scope, $rootScope, $location, $routeParams, HD2FAService, HDUtilService) {
        console.log('Current Location:::'+$location.path());
        $scope.resData = {};
        if ($routeParams.qrString) {
            HD2FAService.getQRImage($routeParams.qrString).then(function successCallback(resData) {
                $scope.resData = resData.data;
                console.log('user 2fa success..' + resData);
            }, function errorCallback(resData) {
                console.log('user 2fa failed..' + resData);
            });
        }
    }]);


'use strict';

angular.module('HDHome', ['ngRoute', 'ngCookies','ngAnimate', 'ui.bootstrap'])

    .controller('HDHomeController',
    ['$scope', '$rootScope','$cookieStore', 'HDHomeService','HDUserService','HDUtilService',
        function ($scope, $rootScope, $cookieStore,HDHomeService,HDUserService,HDUtilService) {

            if($cookieStore.get('globals')) {
                $rootScope.appConfig = {
                    headers: {
                        'Authorization': 'Bearer ' + $cookieStore.get('globals').currentUser.authdata,
                        'Accept': 'application/json;'
                    }
                };
            }

            $rootScope.$on('whatevereventnameyouwant', function(event, data) { console.log('ROOT::::EMIT'+data); });
            $rootScope.ErrorPoint = {};
            $rootScope.MessageCSS={};
            $rootScope.MessageCSS.error='danger';
            $rootScope.MessageCSS.success='success';

            $rootScope.logout=function(){
                HDHomeService.logout();
            };

            $rootScope.resetMessagePoint = function () {
                //                MessagePoint.type;
                //                MessagePoint.message;
                $rootScope.MessagePoint = {};
            };



            $rootScope.formErrorMessagePoint = function (code, message) {
                $rootScope.MessagePoint.code = code;
                $rootScope.MessagePoint.message = message;
                $rootScope.MessagePoint.flag=true;
                $rootScope.MessagePoint.type='error';
                $rootScope.MessagePoint.cssType=$rootScope.MessageCSS.error;
            };

            $rootScope.formSuccessMessagePoint = function (code, message) {
                $rootScope.MessagePoint.code = code;
                $rootScope.MessagePoint.message = message;
                $rootScope.MessagePoint.flag=true;
                $rootScope.MessagePoint.type='success';
                $rootScope.MessagePoint.cssType=$rootScope.MessageCSS.success;
            };

            $rootScope.setMsgTrue = function () {
                $rootScope.rtMsg = true;
            }

            $rootScope.setMsgFalse = function () {
                $rootScope.rtMsg = false;
            }

            HDHomeService.myProfile().then(function successCallback(response) {
                console.log(' profile user: ' + response);
                $rootScope.userProfile = response.data;
                $rootScope.roleBasedLinks=HDUtilService.getRoleBasedArrayLinks2($rootScope.userProfile.roles);
                $rootScope.roleColors=HDUtilService.getRoleColors();
                $scope.getRoleColor=function(rolename){
                    return $rootScope.roleColors[rolename];
                };
            }, function errorCallback(response) {
                $rootScope.userProfile = {};
                console.log('error in getting my profile..' + response);
            });
        }]);
var mainApp = angular.module("HDHome");

mainApp.controller('AddStudentController', function ($scope) {
    $scope.message = "This page will be used to display add student form";
});

mainApp.controller('ViewStudentsController', function ($scope) {
    $scope.message = "This page will be used to display all the students";
});

mainApp.controller('UserListController', ['$scope', 'HDUserService', function ($scope, HDUserService) {
    $scope.hasRole = function (rolename, roles) {
        return HDUserService.hasRole(rolename, roles);
    };
    HDUserService.getAll().success(function (result) {
        $scope.userList = result.result;
    }).error(function (errResponse) {
        console.log('error to view userList: ' + errResponse);
    });
}]);

mainApp.controller('TicketListController', ['$scope', '$rootScope', '$routeParams', 'HDTicketService', 'HDUtilService',
    function ($scope, $rootScope, $routeParams, HDTicketService, HDUtilService) {
        $rootScope.resetMessagePoint();
        if ($routeParams.mode == 3) {
            HDTicketService.myRaised().success(function (ticketList) {
                $scope.ticketList = ticketList;
            }).error(function (errResponse) {
                console.log('error to view my raised ticketList: ' + errResponse);
                $rootScope.formErrorMessagePoint(404, errResponse);
            });
        }
        else{
        if ($routeParams.mode == 2) {
            HDTicketService.own().success(function (ticketList) {
                $scope.ticketList = ticketList;
            }).error(function (errResponse) {
                console.log('error to view my ticketList: ' + errResponse);
                $rootScope.formErrorMessagePoint(404, errResponse);
            });
        } else {
            if ($routeParams.mode == 1) {
                HDTicketService.getMyCategorised().success(function (ticketList) {
                    $scope.ticketList = ticketList;
                }).error(function (errResponse) {
                    console.log('error to view ticketList: ' + errResponse);
                    $rootScope.formErrorMessagePoint(404, errResponse);
                });
            } else {
                HDTicketService.getAll().success(function (ticketList) {
                    $scope.ticketList = ticketList;
                }).error(function (errResponse) {
                    console.log('error to view ticketList: ' + errResponse);
                });
            }
        }}
    }]);

mainApp.controller('UserController', ['$scope', '$rootScope', '$location', '$routeParams', 'HDUserService', 'HDUtilService',
    function ($scope, $rootScope, $location, $routeParams, HDUserService, HDUtilService) {
        console.log('Current Location:::'+$location.path());
        $scope.resData = {};

        if ($routeParams.userId) {
            $scope.myparam = $routeParams.userId;
            HDUserService.getUserById($routeParams.userId).success(function (srvData) {
                var resData=srvData.result;
                console.log('user viewed successfully..' + resData);
                if (resData.email) {
                    $scope.resData = resData;
                    $scope.roleAdmin = HDUserService.hasRole('Admin', resData.roles);
                    $scope.roleSupport = HDUserService.hasRole('Support', resData.roles);
                    $scope.roleCustomer = HDUserService.hasRole('Customer', resData.roles);
                }
                else {
                    $scope.resData.rcvd = 'false';
                }

            }).error(function (resData) {
                console.log('user view failed..' + resData);
            });
        }
        else {
            $scope.myparam = 'not present';
        }


        $scope.addUser = function () {
            $rootScope.resetMessagePoint();
            HDUserService.addUser($scope.resData, $scope.roleAdmin, $scope.roleSupport, $scope.roleCustomer).success(function (resData) {
                console.log('user added successfully..' + resData);
                $location.path('/userView/' + resData.result._id);
            }).error(function (resData) {
                $rootScope.formErrorMessagePoint(404, resData.errorMessage);
                console.log('user added failed..' + resData);
            });

        }

    }]);


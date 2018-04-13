(function () {
    'use strict';

    angular
        .module('app')
        .controller('recoverController', recoverController);

    recoverController.$inject = ['$location','FlashService','$rootScope','AuthenticationService'];
    function recoverController($location,FlashService,$rootScope,AuthenticationService) {

/*
        var vm = this;
        vm.login = login;

        (function initController() {
            // reset login status
            $rootScope.isClinic = false;
            $rootScope.isGuest = false;
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;

            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password,response.data,false);
                    $rootScope.loggedIn = true;
                    $rootScope.userName = response.data.name;
                    $location.path('/home');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
*/
    }

})();

(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$http', 'FlashService','$rootScope','AuthenticationService'];
    function LoginController($location, $http, FlashService,$rootScope,AuthenticationService) {
		

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
	
    }

})();

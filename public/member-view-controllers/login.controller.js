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
			
		/*	$http.post(loginURL, userId).then(
            function(response){
                if (response.statusText == "OK" && response.data) {
					
						if(response.data.password == vm.password){
							AuthenticationService.SetCredentials(vm.username, vm.password,response.data,false);
							$rootScope.loggedIn = true;
							$rootScope.userName = response.data.name;
							isClinicAdmin();
						}
						else{
							$rootScope.loggedIn = false;
							FlashService.Error("Invalid Password");
							vm.dataLoading = false;
						}
                                          
				} else {
					FlashService.Error("Invalid Username and Password");
					vm.dataLoading = false;
				}
            }); */
			
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

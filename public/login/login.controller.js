﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$http', 'FlashService','$rootScope','AuthenticationService'];
    function LoginController($location, $http, FlashService,$rootScope,AuthenticationService) {
		

        var vm = this;
		var loginURL = "http://localhost:3000/findUserById";
		$rootScope.isClinic = false;
		$rootScope.isGuest = false;
        vm.login = login;

        /*(function initController() {
            // reset login status
			$rootScope.isClinic = false;
            AuthenticationService.ClearCredentials();
        })();*/
		
        function login() {
            vm.dataLoading = true;
			var userId = {"userId":vm.username};
			$http.post(loginURL, userId).then(
            function(response){
                if (response.statusText == "OK" && response.data) {
					
						if(response.data.password == vm.password){
							AuthenticationService.SetCredentials(vm.username, vm.password,response.data);
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
            });
			
           /* AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            }); */
        };
		
		var isClinicAdmin = function(){
			if (vm.username == "S1234567E"){
				$location.path('/listPatient');
				$rootScope.isClinic = true;
				$rootScope.clinicId = "5ac1eea8060125dfe7296488"; //hard-code for testing purpose
			}
			else{
				$location.path('/home');
			}
		}
    }

})();

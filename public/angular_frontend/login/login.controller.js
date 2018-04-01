(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$http', 'FlashService','$rootScope','AuthenticationService'];
    function LoginController($location, $http, FlashService,$rootScope,AuthenticationService) {
		

        var vm = this;
		var loginURL = "http://localhost:3000/findUserById";
		$rootScope.userId = vm.username; 
		
		$rootScope.clinicId = '02';  //for testing purpose
        vm.login = login;

       /* (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
		*/
        function login() {
            vm.dataLoading = true;
			var userId = {"userId":vm.username};
			$http.post(loginURL, userId).then(
            function(response){
                if (response.statusText == "OK") {
						if(response.data.password == vm.password){
							AuthenticationService.SetCredentials(vm.username, vm.password);
							$location.path('/');
							$rootScope.isClinic = true;
							$rootScope.login = true;
						}
						else{
							FlashService.Error("Invalid Password");
							vm.dataLoading = false;
						}
                                          
				} else {
					FlashService.Error("Invalid NRIC");
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
    }

})();

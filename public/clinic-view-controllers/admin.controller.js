(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$location', '$http', 'FlashService','$rootScope','AuthenticationService'];
    function AdminController($location, $http, FlashService,$rootScope,AuthenticationService) {
		

        var vm = this;
		var loginURL = "http://localhost:3000/findClinicById";
		$rootScope.isClinic = false;
		$rootScope.isGuest = false;
        vm.adminLogin = adminLogin;
		
        function adminLogin() {
            vm.dataLoading = true;
			var userId = {"clinicId":vm.username};
			$http.post(loginURL, userId).then(
            function(response){
                if (response.statusText == "OK" && response.data) {
					
						if(response.data._id == vm.username && vm.password == "123123123"){
							AuthenticationService.SetCredentials(vm.username, vm.password,response.data,true);
							$rootScope.loggedIn = true;
							$rootScope.userName = response.data.name;
							$rootScope.isClinic = true;
							$rootScope.clinicId = response.data._id;
							$location.path('/listPatient');
						}
						else{
							$rootScope.loggedIn = false;
							FlashService.Error("Invalid Login");
							vm.dataLoading = false;
							$location.path('/admin');
						}
                                          
				} else {
					FlashService.Error("Invalid Login");
					vm.dataLoading = false;
					$location.path('/admin');
				}
            });
			
           
        };
		

    }

})();

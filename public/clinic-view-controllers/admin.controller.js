(function () {
    'use strict';

    angular
        .module('app')
        .controller('AdminController', AdminController);

    AdminController.$inject = ['$location', 'FlashService','$rootScope','AuthenticationService'];
    function AdminController($location, FlashService,$rootScope,AuthenticationService) {
		

        var vm = this;
		$rootScope.isClinic = false;
		$rootScope.isGuest = false;
        vm.adminLogin = login;
		$rootScope.sidebarHide();
		function login() {
            vm.dataLoading = true;
			
			AuthenticationService.ClinicLogin(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password,response.data,true);
					$rootScope.loggedIn = true;
					$rootScope.userName = response.data.name;
					$rootScope.isClinic = true;
					$rootScope.clinicId = response.data._id;
					$location.path('/listPatient');
                } else {
                    FlashService.Error(response.message);
                    $rootScope.loggedIn = false;
					vm.dataLoading = false;
					$location.path('/admin');
                }
            }); 
        };
	
    }

})();

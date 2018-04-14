(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location','FlashService','User'];
    function RegisterController($location,FlashService,User) {
        var vm = this;
     	$rootScope.sidebarHide();
        vm.register = function() {
           vm.dataLoading = true;
			var dataToSend =
			{
				"nric":vm.user.nric.trim(),
				"email":vm.user.email.trim(),
				"name":vm.user.name.trim(),
				"contact":vm.user.contact,
				"dob":vm.user.dob,
				"password":vm.user.password.trim()
			};
			User.Create(dataToSend)
				.then(function (response) {
					if (response !== null) {
						FlashService.Success('Registration successful', true);
						$location.path('/login');
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
		
		}
	}

})();

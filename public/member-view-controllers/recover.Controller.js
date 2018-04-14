(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecoverPasswordController', RecoverPasswordController);

    RecoverPasswordController.$inject = ['$location','FlashService','$rootScope','User'];
    function RecoverPasswordController($location,FlashService,$rootScope,User) {
		

        var vm = this;
	    vm.recoverPassword = recoverPassword;

        function recoverPassword() {
            vm.dataLoading = true;
			
			User.ResetPasswordByEmail(vm.email)
				.then(function (response) {
						if (response !== null) {
							FlashService.Success("New Password had been sent to your email",false);
						} else {
							FlashService.Error(response.message);
						}
						vm.dataLoading = false;
				});
        };
	
    }

})();

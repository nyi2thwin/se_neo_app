(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecoverPasswordController', RecoverPasswordController);

    RecoverPasswordController.$inject = ['$location','FlashService','$rootScope','User'];
    function RecoverPasswordController($location,FlashService,$rootScope,User) {
		

        var vm = this;
	    vm.recoverPassword = recoverPassword;
	    $rootScope.sidebarHide();
        function recoverPassword() {
            vm.dataLoading = true;
			
			User.ResetPasswordByEmail(vm.email)
				.then(function (response) {
						if (response.hasOwnProperty('_id')) {
							FlashService.Success("New password will be sent to your email shortly.",false);
						} else {
							FlashService.Error("Email not found.",false);
						}
						vm.dataLoading = false;
				});
        };
	
    }

})();

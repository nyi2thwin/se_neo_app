(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$rootScope','$http','$scope','FlashService'];
    function RegisterController($location, $rootScope,$http,$scope,FlashService) {
        var vm = this;
        var registerURL = "http://localhost:3000/register";

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            var dataToSend = 
			{
				"userId":vm.user.nric,
				"email":vm.user.email,
				"name":vm.user.lastName,
				"contact":vm.user.contact,
				"dob":vm.user.dob,
				"password":vm.user.password
			};             
            $http.post(registerURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.statusText);
                        vm.dataLoading = false;
                    }
            });
        }
		
		/*$scope.dobChanged = function () {

				 $("#dob").datepicker({
					   dateFormat: 'dd/mm/yy',
					   onClose: function (text, datePicker) {
							  if (!!text) {
									 vm.user.dob = new Date(datePicker.selectedYear, datePicker.selectedMonth, datePicker.selectedDay);
									  $(this).datepicker('setDate', new Date(datePicker.selectedYear, datePicker.selectedMonth, datePicker.selectedDay));
							  };
					   }
				 });
		}*/
	}

})();

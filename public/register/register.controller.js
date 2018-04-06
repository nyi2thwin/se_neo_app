(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$rootScope','$http','$scope','FlashService','$q'];
    function RegisterController($location, $rootScope,$http,$scope,FlashService,$q) {
        var vm = this;
        var registerURL = "http://localhost:3000/register";

        vm.register = function(){
	       	  	register().then(function (response) {
					FlashService.Success('Registration successful', true);
                    $location.path('/login');
				},
				function (response) {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				});
		};
        var register =function() {
			var deferred = $q.defer();
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
                        
					deferred.resolve(response);
				} else {
					
					deferred.reject(response);
				}
            },
			function (response) {
				FlashService.Error(response.statusText);
				deferred.reject(response);
			});
			
			return deferred.promise;
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

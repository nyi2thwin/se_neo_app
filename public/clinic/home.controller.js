(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope'];
    function HomeController($scope, $http, $filter, $location,$rootScope) {
		 var vm = this;
		 var findBookingByClinicIdURL = "http://localhost:3000/findBookingByClinicId";
		 var clinicId = "02";
		 $scope.patientList = {};
		
		 var init = function(){
            vm.dataLoading = true;
            var dataToSend = 
			{
				"clinicId":clinicId,
			};             
            $http.post(findBookingByClinicIdURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.patientList = response.data;
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		
        }
		 init();
		
    }

})();
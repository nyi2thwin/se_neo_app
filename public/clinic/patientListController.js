(function () {
    'use strict';

    angular
        .module('app')
        .controller('patientListController', patientListController);

    patientListController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope'];
    function patientListController($scope, $http, $filter, $location,$rootScope) {
		 var vm = this;
		 var findBookingByClinicIdURL = "http://localhost:3000/findBookingByClinicId";
		 var clinicId = $rootScope.clinicId;
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
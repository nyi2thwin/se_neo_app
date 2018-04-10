(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewAppointmentHistoryController', viewAppointmentHistoryController);

    viewAppointmentHistoryController.$inject = ['$scope', '$http', '$filter','$rootScope','FlashService'];
    function viewAppointmentHistoryController($scope, $http, $filter, $location,$rootScope,FlashService) {
		 var vm = this;
		 var findBookingByUserIdURL = "http://localhost:3000/findClinicById";
		 var bookingURL = "";
		 var dataBeforeUpdate = {};

		 $scope.mdata = {};
		 $scope.disableForm = true;
		 vm.dataLoading = false;

		 var init = function(){
            var dataToSend = 
			{
				"userId":$rootScope.globals.currentUser.username,
			};             
            $http.post(findBookingByUserIdURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK" && response.data) {
					if(response.data.length == 0){
						FlashService.Error("You have no appointment history");
					}
                    $scope.mdata.bookings = response.data;
				} else {
					FlashService.Error(response.statusText);
				}
				vm.dataLoading = false;
            },
			function (response) {                          
				FlashService.Error("Unable to Retrieve Appointment History!Please try again later");
				vm.dataLoading = false;
			});
		}


		$scope.book = function(){
			var dataToSend = $scope.mdata;
			vm.dataLoading = true;
			$http.post(bookingURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.mdata = response.data;
					FlashService.Success('Update successful', true);
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            },
			function (response) {                          
				FlashService.Error(response.statusText);
				vm.dataLoading = false;
			});
		}
		//init();
		
    }

})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewAppointmentHistoryController', viewAppointmentHistoryController);

    viewAppointmentHistoryController.$inject = ['$scope', '$rootScope', 'FlashService', 'Booking'];
    function viewAppointmentHistoryController($scope, $rootScope, FlashService, Booking) {
		 var vm = this;

		 $scope.mdata = {};
		 $scope.disableForm = true;
		 $scope.disableAppointment = true;
		 vm.dataLoading = false;

		 var init = function(){
			vm.dataLoading = true;
		
			Booking.FindUserCurrentAppointment($rootScope.globals.currentUser.id)
			.then(function (response) {
					if (response !== null && response.success && response.data != null) {
							
						$scope.mdata.currentBooking = response.data;
						if(response.data.length == 0) {
							$scope.disableAppointment = false;
						}
						else{
							$scope.disableAppointment = true;
						}
					} else {
						FlashService.Error(response.message);
						$scope.disableAppointment = false;
					}
					vm.dataLoading = false;
			});
			
		 
			Booking.FindUserAppointHistory($rootScope.globals.currentUser.id)
				.then(function (response) {
					if (response !== null && response.success) {
						$scope.mdata.bookings = response.data;
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
		
		}

		vm.book = function(clinic){
			vm.dataLoading = true;
			Booking.MakeAppointment($rootScope.globals.currentUser.id,clinic._id, function (response) {
                if (response != null && response.success) {
                    FlashService.Success(response.message,false);
					init();
                } else {
                    FlashService.Error(response.message);
                }
				vm.dataLoading = false;
            }); 
		}
		
		vm.cancel = function(bookingId){
			vm.dataLoading = true;
			Booking.Delete(bookingId)
				.then(function (response) {
					if (response !== null && response.success) {
							
						FlashService.Success("Appointment is canceled successfully!");
						$scope.disableAppointment = false;
						init();
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
		}
		init();
		
    }

})();
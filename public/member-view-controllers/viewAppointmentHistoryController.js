(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewAppointmentHistoryController', viewAppointmentHistoryController);

    viewAppointmentHistoryController.$inject = ['$scope', '$rootScope', 'FlashService', 'Booking'];
    function viewAppointmentHistoryController($scope, $rootScope, FlashService, Booking) {
		 var vm = this;
		 var findBookingByUserIdURL = "http://localhost:3000/findClinicById";
		 var bookingURL = "";
		 var dataBeforeUpdate = {};

		 $scope.mdata = {};
		 $scope.disableForm = true;
		 vm.dataLoading = false;

		 var init = function(){
			vm.dataLoading = true;
			Booking.FindBookingByUserId($rootScope.globals.currentUser.id)
				.then(function (response) {
					if (response !== null && response.success) {
						if(response.data.length == 0){
							FlashService.Error("You have no appointment history");
						}
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
                if (response != null & response.success) {
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
							
						FlashService.Success(response.data.message);
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
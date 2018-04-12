(function () {
    'use strict';

    angular
        .module('app')
        .controller('patientListController', patientListController);

    patientListController.$inject = ['$scope', '$rootScope', 'FlashService', 'Booking'];
    function patientListController($scope, $rootScope, FlashService, Booking) {
		var vm = this;
		var clinicId = $rootScope.globals.currentUser.id;
		$scope.patientList = {};

		$scope.unqueue = function(bookingId){
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
		
		$scope.notify = function(bookingId){
			vm.dataLoading = true;
		
			Booking.Notify(bookingId)
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

		$scope.mark_visit = function(bookingId){
			vm.dataLoading = true;
			Booking.MarkVisited(bookingId)
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
		var init = function(){
			vm.dataLoading = true;
			
			Booking.FindBookingByClinicId(clinicId)
				.then(function (response) {
					if (response !== null && response.success) {
							
						if(response.data.length == 0){
							FlashService.Error("No Patients in Queue!");
						}
				        $scope.patientList = response.data;
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
       	}
		init();
    }

})();
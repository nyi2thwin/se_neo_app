(function () {
    'use strict';

    angular
        .module('app')
        .controller('patientListController', patientListController);

    patientListController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope','FlashService'];
    function patientListController($scope, $http, $filter, $location,$rootScope,FlashService) {
		var vm = this;
		var findBookingByClinicIdURL = "/findBookingByClinicId";
		var clinicId = $rootScope.globals.currentUser.userID;
		$scope.patientList = {};

		$scope.unqueue = function(bookingId){
			vm.dataLoading = true;
			var dataToSend = 
			{
				"bookingId":bookingId,
			};             
			$http.post("/deleteBooking", dataToSend).then(
				function(response){
				    if (response.statusText == "OK") {
				    	console.log(response);
						FlashService.Success(response.data.message);
						init();
					} else {
						FlashService.Error(response.statusText);
						vm.dataLoading = false;
					}
				});

		}
		$scope.notify = function(bookingId){
			vm.dataLoading = true;
			var dataToSend = 
			{
				"bookingId":bookingId,
			};             
			$http.post("/sendNotification", dataToSend).then(
				function(response){
				    if (response.statusText == "OK") {
				    	console.log(response);
						FlashService.Success(response.data.message);
						init();
					} else {
						FlashService.Error(response.statusText);
						vm.dataLoading = false;
					}
				});

		}
		var init = function(){
			vm.dataLoading = true;
			var dataToSend = 
			{
				"clinicId":clinicId,
			};             
			$http.post(findBookingByClinicIdURL, dataToSend).then(
				function(response){
				    if (response.statusText == "OK") {
						if(response.data.length == 0){
							FlashService.Error("No Patients in Queue!");
						}
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
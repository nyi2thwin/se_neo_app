(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope','FlashService'];
    function homeController($scope, $http, $filter, $location,$rootScope,FlashService) {
		var vm = this;
		$scope.hideSearchBox = true;
		$scope.hideResult = false;
		var loggedIn = $rootScope.globals.currentUser;
		if(!loggedIn){
			$rootScope.isGuest = true;
		}
		else{
			$rootScope.isGuest = false;
		}
		var findNearByClinicURL = "http://localhost:3000/getNearByClinic/"+vm.postalCode;
		var findBookingByClinicIdURL = "http://localhost:3000/findBookingByClinicId";
		var bookURL = "http://localhost:3000/book";
		$scope.mdata ={};
		$scope.clinicList = {};
		vm.dataLoading = false;
		vm.search = search;
		function search() {
            vm.dataLoading = true;
            $http.get(findNearByClinicURL).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.clinicList = response.data;
					vm.dataLoading = false;
					$scope.hideSearchBox = false;
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		
        }
		vm.viewDetail = function(clinic){
			$scope.hideResult = true;
			$scope.mdata.clinic = clinic;
		}
		vm.backToResult = function(){
			$scope.hideResult = false;
		}
		
		vm.makeAppoint = function(){
			vm.dataLoading = true;
            var dataToSend = 
			{
				"clinicId":$scope.mdata.clinic._id,
			};             
            $http.post(findBookingByClinicIdURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
					var lastIndex = response.data.length;
					var lastQno = 0;
					if(lastIndex != 0){
						lastQno = response.data[lastIndex-1].queNo;
					}
					var newQno = lastQno + 1;
					
					//call book function
					book(newQno);
					
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		}
		
		var book = function(newQno){
			var currentDate =  $filter('date')(new Date(), "MM-dd-yyyy");
			//prepare booking obj
			var dataToSend =
			{
				"userId": loggedIn.username,
				"clinicId":$scope.mdata.clinic._id,
				"dateTime":currentDate,
				"queNo":newQno,
				"status":"waiting",
				"estimatedTime":"20"
			}
			$http.post(bookURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
					FlashService.Success("Appointment Successful.Your Quno is "+newQno.toString(),false);
					vm.dataLoading = false;
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		}
		
    }

})();
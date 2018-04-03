(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewClinicController', viewClinicController);

    viewClinicController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope'];
    function viewClinicController($scope, $http, $filter, $location,$rootScope) {
		 var vm = this;
		 var findClinicByClinicIdURL = "http://localhost:3000/findClinicById";
		 var updateMyClinicInfoURL = "http://localhost:3000/updateClinic"; //To be update the link
		 var clinicId = "5ac1eea8060125dfe7296488"; //hard-code for testing purpose
		 $scope.mdata = {};
		 var dataBeforeUpdate = {};
		 $scope.disableForm = true;
		 vm.dataLoading = false;
		 var init = function(){
            
            var dataToSend = 
			{
				"clinicId":clinicId,
			};             
            $http.post(findClinicByClinicIdURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.mdata = response.data;
					dataBeforeUpdate = angular.copy($scope.mdata);
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
		
		$scope.enableFormEdit = function(){
			$scope.disableForm = false;
		}
		$scope.cancelFormEditing = function(){
			$scope.disableForm = true;
			$scope.mdata = angular.copy(dataBeforeUpdate);
		}
		$scope.updateMyClinicInfo = function(){
			var dataToSend = $scope.mdata;
			vm.dataLoading = true;
			$http.post(updateMyClinicInfoURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.mdata = response.data;
					$scope.cancelFormEditing();
					lashService.Success('Update successful', true);
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
		init();
		
    }

})();
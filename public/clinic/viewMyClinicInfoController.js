﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewMyClinicInfoController', viewMyClinicInfoController);

    viewMyClinicInfoController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope','FlashService'];
    function viewMyClinicInfoController($scope, $http, $filter, $location,$rootScope,FlashService) {
		 var vm = this;
		 var findClinicByClinicIdURL = "http://localhost:3000/findClinicById";
		 var updateMyClinicInfoURL = "http://localhost:3000/updateClinic"; //To be update the link
		 $scope.mdata = {};
		 var dataBeforeUpdate = {};
		 $scope.disableForm = true;
		 vm.dataLoading = false;
		 var init = function(){
            
            var dataToSend = 
			{
				"clinicId":$rootScope.globals.currentUser.userID,
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
			delete dataToSend.reviews;
			vm.dataLoading = true;
			$http.post(updateMyClinicInfoURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.mdata = response.data;
					$scope.cancelFormEditing();
					FlashService.Success('Update successful', false);
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
		init();
		
    }

})();
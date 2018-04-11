(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewMyClinicInfoController', viewMyClinicInfoController);

    viewMyClinicInfoController.$inject = ['$scope', '$location','$rootScope','FlashService','Clinic'];
    function viewMyClinicInfoController($scope, $location,$rootScope,FlashService, Clinic) {
		 var vm = this;
		 vm.dataLoading = false;
		 $scope.mdata = {};
		 $scope.disableForm = true;
		 
		 var dataBeforeUpdate = {};
		 
		 var init = function(){
            
			vm.dataLoading = true;
			Clinic.FindClinicById($rootScope.globals.currentUser.id)
				.then(function (response) {
					if (response !== null && response.success) {
						$scope.mdata = response.data;
						dataBeforeUpdate = angular.copy($scope.mdata);
					} else {
						FlashService.Error(response.message);
					}
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
	
			Clinic.Update(dataToSend)
				.then(function (response) {
					if (response !== null && response.success) {
						$scope.mdata = response.data;
						$scope.disableForm = true;
						$rootScope.userName = response.data.name;
						dataBeforeUpdate = angular.copy($scope.mdata);
						
						FlashService.Success('Update successful', false);
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});

		}
		init();
		
    }

})();
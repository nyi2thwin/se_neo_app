(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewMyInfoController', viewMyInfoController);

    viewMyInfoController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope','FlashService'];
    function viewMyInfoController($scope, $http, $filter, $location,$rootScope,FlashService) {
		 var vm = this;
		 var findUserByIdURL = "http://localhost:3000/findUserByNric";
		 var updateMyInfoURL = "http://localhost:3000/updateUser";
		 $scope.mdata = {};
		 var dataBeforeUpdate = {};
		 $scope.disableForm = true;
		 vm.dataLoading = false;
		 var init = function(){
            var userId = {"userId":$rootScope.globals.currentUser.username};
                     
            $http.post(findUserByIdURL, userId).then(
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
				vm.dataLoading = false;
				FlashService.Error("Error Connection Refused");
			});
		}
		
		$scope.enableFormEdit = function(){
			$scope.disableForm = false;
		}
		$scope.cancelFormEditing = function(){
			$scope.disableForm = true;
			$scope.mdata = angular.copy(dataBeforeUpdate);
		}
		$scope.updateMyInfo = function(){
			var dataToSend = $scope.mdata;
			vm.dataLoading = true;
			$http.post(updateMyInfoURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.mdata = response.data;
					$scope.disableForm = true;
					$rootScope.userName = response.data.name;
					FlashService.Success('Update successful', false);
					vm.dataLoading = false;
					dataBeforeUpdate = angular.copy($scope.mdata);
				
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				
				}
            },
			function (response) {
				vm.dataLoading = false;
				FlashService.Error("Error Connection Refused");
			});

		}
		
		init();
		
    }

})();
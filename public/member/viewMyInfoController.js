(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewMyInfoController', viewMyInfoController);

    viewMyInfoController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope'];
    function viewMyInfoController($scope, $http, $filter, $location,$rootScope) {
		 var vm = this;
		 var findUserByIdURL = "http://localhost:3000/findUserById";
		 var updateMyInfoURL = "http://localhost:3000/updateUserInfo"; //To be update the link
		 var clinicId = "5ac1eea8060125dfe7296488"; //hard-code for testing purpose
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
		$scope.updateMyInfo = function(){
			var dataToSend = $scope.mdata;
			vm.dataLoading = true;
			$http.post(updateMyInfoURL, dataToSend).then(
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
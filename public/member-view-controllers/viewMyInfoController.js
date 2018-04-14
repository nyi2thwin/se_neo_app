(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewMyInfoController', viewMyInfoController);

    viewMyInfoController.$inject = ['$scope', '$rootScope','FlashService','User'];
    function viewMyInfoController($scope, $rootScope, FlashService, User) {
		 var vm = this;

		 $scope.mdata = {};
		 var dataBeforeUpdate = {};
		 $scope.disableForm = true;
		 vm.dataLoading = false;
		 
		 var init = function(){
            vm.dataLoading = true;
			
			User.GetByNric($rootScope.globals.currentUser.username)
				.then(function (user) {
					if (user !== null && user._id) {
						$scope.mdata = user;
						$scope.mdata.cpassword = user.password;
						dataBeforeUpdate = angular.copy($scope.mdata);
					} else {
						FlashService.Error(user.message);
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
		$scope.updateMyInfo = function(){
			vm.dataLoading = true;
			
			User.Update($scope.mdata)
				.then(function (user) {
					if (user !== null && user._id) {
						$scope.mdata = user;
						$scope.disableForm = true;
						$rootScope.userName = user.name;
						FlashService.Success('Update successful', false);
						$scope.mdata.cpassword = user.password;
						dataBeforeUpdate = angular.copy($scope.mdata);
					} else {
						FlashService.Error(user.message);
					}
					vm.dataLoading = false;
			});
		
		}
		
		init();
		
    }

})();
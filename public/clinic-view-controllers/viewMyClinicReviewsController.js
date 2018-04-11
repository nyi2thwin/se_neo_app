(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewMyClinicReviewsController', viewMyClinicReviewsController);

    viewMyClinicReviewsController.$inject = ['$scope','$rootScope','FlashService', 'Clinic'];
    function viewMyClinicReviewsController($scope,$rootScope,FlashService, Clinic) {
		var vm = this;
		$scope.mdata = {};
		vm.dataLoading = false;
		
		var init = function(){
			 
			vm.dataLoading = true;
			Clinic.FindClinicById($rootScope.globals.currentUser.id)
				.then(function (response) {
					if (response !== null && response.success && response.data.reviews) {
						if(response.data.reviews.length == 0){
							FlashService.Error("Your Clinic have any reviews yet!");
						}
						$scope.mdata.reviews = response.data.reviews;
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
		}
		init();
	}

})();
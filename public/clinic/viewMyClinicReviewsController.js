(function () {
    'use strict';

    angular
        .module('app')
        .controller('viewMyClinicReviewsController', viewMyClinicReviewsController);

    viewMyClinicReviewsController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope','FlashService'];
    function viewMyClinicReviewsController($scope, $http, $filter, $location,$rootScope,FlashService) {
		 var vm = this;
		 var findClinicByClinicIdURL = "http://localhost:3000/findClinicById";
		 $scope.mdata = {};
		 vm.dataLoading = false;
		 var init = function(){
            
            var dataToSend = 
			{
				"clinicId":$rootScope.globals.currentUser.userID,
			};             
            $http.post(findClinicByClinicIdURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK" && response.data) {
					if(response.data.reviews.length == 0){
						FlashService.Error("Your Clinic have any reviews yet!");
					}
                    $scope.mdata.reviews = response.data.reviews;
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
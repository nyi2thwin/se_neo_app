﻿(function () {
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
				"clinicId":$rootScope.globals.currentUser.id,
			};             
            $http.post(findClinicByClinicIdURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK" && response.data.reviews) {
					if(response.data.reviews.length == 0){
						FlashService.Error("Your Clinic have any reviews yet!");
					}
                    $scope.mdata.reviews = response.data.reviews;
				} else {
					FlashService.Error("Unable to retrieve Reviews!Please Contact Admin!");
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
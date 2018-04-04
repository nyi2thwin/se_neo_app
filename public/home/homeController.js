(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope'];
    function homeController($scope, $http, $filter, $location,$rootScope) {
		 var vm = this;
		 $scope.hideSearchBox = true;
		 var loggedIn = $rootScope.globals.currentUser;
		 if(!loggedIn){
			$rootScope.isGuest = true;
		 }
		 else{
			$rootScope.userName = loggedIn.username;
			$rootScope.isGuest = false;
		 }
		 var findNearByClinicURL = "http://localhost:3000/getNearByClinic/"+vm.postalCode;
		
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
	
		
    }

})();
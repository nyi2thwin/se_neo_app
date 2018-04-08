(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);
	
	homeController.$inject = ['$scope','$http','$rootScope','FlashService','$q','$filter'];
    function homeController($scope, $http,$rootScope,FlashService,$q,$filter) {
		var vm = this;
		vm.dataLoading = false;
		
		$scope.hideSearchBox = true;
		$scope.hideSearchResult = true;
		$scope.hideDetailResult = true;
		$scope.showReviewBox = false;
		$scope.firstRate = 0;
		$scope.newComment = "";
		$scope.mdata ={};
		$scope.clinicList = {};
		
		
		var addReviewURL = "http://localhost:3000/addReview";
		var viewClinicDetailURL = "http://localhost:3000/findClinicById";
		var findBookingByClinicIdURL = "http://localhost:3000/findBookingByClinicId";
		var bookURL = "http://localhost:3000/book";
		
		var loggedIn = $rootScope.globals.currentUser;
		if(!loggedIn){
			$rootScope.isGuest = true;
		}
		else{
			$rootScope.isGuest = false;
		}
		
	
		vm.search = function() {
            vm.dataLoading = true;
			var findNearByClinicURL = "http://localhost:3000/getNearByClinic/"+$scope.postalCode;
            $http.get(findNearByClinicURL).then(
            function(response){
                if (response.statusText == "OK") {
                    $scope.clinicList = response.data;
					vm.dataLoading = false;
					$scope.hideSearchBox = false;
					$scope.hideSearchResult = false;
					$scope.hideDetailResult = true;
					for (var i = 0; i < $scope.clinicList.length; i++){
						createMarker($scope.clinicList[i]);
					}
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		
        }
		vm.viewDetail = function(clinic){
			
			vm.dataLoading = true;
            var dataToSend = 
			{
				"clinicId":clinic._id,
			};             
            $http.post(viewClinicDetailURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
					$scope.hideSearchResult = true;
					$scope.hideDetailResult = false;
					$scope.mdata.clinic = response.data;
					vm.dataLoading = false;
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		}
		vm.backToResult = function(){
			$scope.hideSearchResult = false;
			$scope.hideDetailResult = true;
		}
		vm.makeAppoint = function(){
			vm.dataLoading = true;
            var dataToSend = 
			{
				"clinicId":$scope.mdata.clinic._id,
			};             
            $http.post(findBookingByClinicIdURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
					var lastIndex = response.data.length;
					var lastQno = 0;
					if(lastIndex != 0){
						lastQno = response.data[lastIndex-1].queNo;
					}
					var newQno = lastQno + 1;
					
					//call book function
					book(newQno);
					
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		}
		vm.enableReviewBox = function(){
			$scope.showReviewBox = true;
		}
		vm.cancelReview = function(){
			$scope.showReviewBox = false;
			$scope.firstRate = 0;
			$scope.newComment = "";
		}
		vm.submitReview = function(){
			var deferred = $q.defer();
            vm.dataLoading = true;
            var dataToSend = 
			{
				"_clinicId":$scope.mdata.clinic._id,
				"_userId":loggedIn.userID,
				"content":$scope.newComment,
				"username":loggedIn.name,
				"rating":$scope.firstRate,
				"datetime":new Date()
			};          
			
            $http.post(addReviewURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
                   $scope.mdata.clinic.reviews.push(response.data);
					vm.cancelReview();
					vm.dataLoading = false;
					deferred.resolve(response);
				} else {
					vm.dataLoading = false;
					deferred.reject(response);
				}
            },
			function (response) {
				FlashService.Error(response.statusText);
				deferred.reject(response);
			});
			
			return deferred.promise;
		}
		var book = function(newQno){
			var currentDate =  $filter('date')(new Date(), "MM-dd-yyyy");
			//prepare booking obj
			var dataToSend =
			{
				"userId": loggedIn.username,
				"clinicId":$scope.mdata.clinic._id,
				"dateTime":currentDate,
				"queNo":newQno,
				"status":"waiting",
				"estimatedTime":"20"
			}
			$http.post(bookURL, dataToSend).then(
            function(response){
                if (response.statusText == "OK") {
					FlashService.Success("Appointment Successful.Your Quno is "+newQno.toString(),false);
					vm.dataLoading = false;
				} else {
					FlashService.Error(response.statusText);
					vm.dataLoading = false;
				}
            });
		}
		
		var mapOptions = {
                  zoom: 13,
                  center: new google.maps.LatLng(1.290270,103.851959),
                  mapTypeId: google.maps.MapTypeId.TERRAIN
        }

		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

		$scope.markers = [];
	  
		var infoWindow = new google.maps.InfoWindow();
		
		var createMarker = function (clinic){
                  
			var marker = new google.maps.Marker({
				map: $scope.map,
				position: new google.maps.LatLng(clinic.location[0], clinic.location[1]),
				title:clinic.name
			});
			marker.content = '<div class="infoWindowContent">' + clinic.address + '</div>';
		  
			google.maps.event.addListener(marker, 'click', function(){
				infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
				infoWindow.open($scope.map, marker);
			});
		  
			$scope.markers.push(marker);
                  
        }  
		
		$scope.openInfoWindow = function(e, selectedMarker){
			e.preventDefault();
			google.maps.event.trigger(selectedMarker, 'click');
		}

	
	
	

    }

})();
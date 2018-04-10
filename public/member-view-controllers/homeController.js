(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);
	
	homeController.$inject = ['$scope','$rootScope','FlashService','BookingService','ClinicService'];
    function homeController($scope,$rootScope,FlashService,BookingService,ClinicService) {
		var vm = this;
		vm.dataLoading = false;
		
		$scope.hideSearchBox = true;
		$scope.hideSearchResult = true;
		$scope.hideDetailResult = true;
		$scope.showReviewBox = false;
		$scope.firstRate = 0;
		$scope.newComment = "";
		$scope.mdata ={};
		$scope.markers = []; 
		$scope.clinicList = {};
		
				
		var loggedIn = $rootScope.globals.currentUser;
		if(!loggedIn){
			$rootScope.isGuest = true;
		}
		else{
			$rootScope.isGuest = false;
		}
		
		vm.search = function() {
			var response;
			vm.dataLoading = true;
			ClinicService.GetNearByClinic($scope.postalCode)
				.then(function (response) {
					if (response !== null && response.success) {
						$scope.clinicList = response.data;
						
						$scope.markers = []; //clear markers
						
						$scope.hideSearchBox = false;
						$scope.hideSearchResult = false;
						$scope.hideDetailResult = true;
						for (var i = 0; i < $scope.clinicList.length; i++){
							createMarker($scope.clinicList[i]);
						}
						
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
        }
		
		vm.viewDetail = function(clinicId) {
			var response;
			vm.dataLoading = true;
			ClinicService.FindClinicById(clinicId)
				.then(function (response) {
					if (response !== null && response.success) {
						$scope.clinicList = response.data;
						
						$scope.hideSearchResult = true;
						$scope.hideDetailResult = false;
						$scope.mdata.clinic = response.data;
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
        }
		
		vm.backToResult = function(){
			$scope.hideSearchResult = false;
			$scope.hideDetailResult = true;
		}

		vm.makeAppoint = function(){
			vm.dataLoading = true;
			BookingService.MakeAppointment(loggedIn.id,$scope.mdata.clinic._id, function (response) {
                if (response != null & response.success) {
                    FlashService.Success(response.message,false);
                } else {
                    FlashService.Error(response.message);
                }
				vm.dataLoading = false;
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
            vm.dataLoading = true;
            var dataToSend = 
			{
				"_clinicId":$scope.mdata.clinic._id,
				"_userId":loggedIn.id,
				"content":$scope.newComment,
				"username":loggedIn.name,
				"rating":$scope.firstRate,
				"datetime":new Date()
			};   
			
			ClinicService.AddReview(dataToSend)
				.then(function (response) {
					if (response !== null && response.success) {
						$scope.mdata.clinic.reviews.push(response.data);
						vm.cancelReview();
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
			
		}
		
		/********************* Map Section ***********************************/
				
		var mapOptions = {
                  zoom: 13,
                  center: new google.maps.LatLng(1.290270,103.851959),
                  mapTypeId: google.maps.MapTypeId.TERRAIN
        }
		$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

	  
		var infoWindow = new google.maps.InfoWindow();
		$scope.openInfoWindow = function(e, selectedMarker){
			e.preventDefault();
			google.maps.event.trigger(selectedMarker, 'click');
		}
		
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
		
		

	
	
	

    }

})();
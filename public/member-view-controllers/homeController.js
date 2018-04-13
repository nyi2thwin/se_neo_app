(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);
	
	homeController.$inject = ['$scope','$rootScope','FlashService','Booking','Clinic','Review'];
    function homeController($scope,$rootScope,FlashService,Booking,Clinic,Review) {
		var vm = this;
		vm.dataLoading = false;
		$scope.disableAppointment = false;
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
		var init = function() {
			Booking.FindUserCurrentAppointment(loggedIn.id)
				.then(function (response) {
						if (response !== null && response.success) {
							if(response.data.length != 0){
								$scope.disableAppointment = true;	
							}else{
								$scope.disableAppointment = false;
							}
						} else {
							FlashService.Error(response.message);
						}
						vm.dataLoading = false;
				});
		}
		
		if(!loggedIn){
			$rootScope.isGuest = true;
		}
		else{
			$rootScope.isGuest = false;
			init();
		}
		
		
		
		vm.search = function() {
			vm.dataLoading = true;
			Clinic.GetNearByClinic($scope.postalCode)
				.then(function (response) {
					if (response !== null && response.success) {
						$scope.clinicList = response.data.clinics;
						$scope.markers = []; //clear markers
						$scope.hideSearchBox = false;
						$scope.hideSearchResult = false;
						$scope.hideDetailResult = true;
						$scope.map.setCenter(new google.maps.LatLng(response.data.lat,response.data.long));
						$scope.map.setZoom(15);
						for (var i = 0; i < $scope.clinicList.length; i++){
							createMarker($scope.clinicList[i]);
							console.log($scope.clinicList[i]);
						}
						
					} else {
						FlashService.Error(response.message);
					}
					vm.dataLoading = false;
			});
        }
		
		vm.viewDetail = function(clinicId) {
			vm.dataLoading = true;
			Clinic.FindClinicById(clinicId)
				.then(function (response) {
					if (response !== null && response.success) {
							
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
			Booking.MakeAppointment(loggedIn.id,$scope.mdata.clinic._id, function (response) {
                if (response != null & response.success) {
                    FlashService.Success(response.message,false);
					$scope.disableAppointment = true;
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
				"clinicId":$scope.mdata.clinic._id,
				"userId":loggedIn.id,
				"content":$scope.newComment,
				"username":loggedIn.name,
				"rating":$scope.firstRate,
				"datetime":new Date()
			};   
			
			Review.AddReview(dataToSend)
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
                  mapTypeId: google.maps.MapTypeId.TERRAIN,
                  styles: [{"featureType":"all","elementType":"geometry.fill","stylers":[{"weight":"2.00"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"color":"#9c9c9c"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#ffffff"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#7b7b7b"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#c8d7d4"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#070707"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]}]
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
				infoWindow.setContent('<h4>' + marker.title + '</h4>' + marker.content);
				infoWindow.open($scope.map, marker);
			});
		  
			$scope.markers.push(marker);
                  
        }  
	
    }

})();
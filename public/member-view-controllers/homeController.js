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
		$scope.estimatedTimeStr = "Estimated waiting time is 5 min(s)."
				
		var loggedIn = $rootScope.globals.currentUser;
		var init = function() {

			if(!isMobile())
				$rootScope.sidebarShow();
			Booking.FindUserCurrentAppointment(loggedIn.id)
				.then(function (response) {
						if (response !== null && response.success) {
							$scope.disableAppointment = (response.data.length !== 0);
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
		
		vm.getLatLong = async function(){
        	//vm.dataLoading = true;
	    	vm.dataLoading = true;
	    	var result = await getLatLongText();
	    	
		  	Clinic.GetNearByClinic(result)
				.then(function (response) {
					
					if (response !== null && response.success && response.data.clinics) {
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
						FlashService.Error("Error in finding clinic. Please use correct postalcode.");
					}
					vm.dataLoading = false;
			});
	    }
		
		vm.search = function() {
			vm.dataLoading = true;
			Clinic.GetNearByClinic($scope.postalCode)
			.then(function (response) {
				if (response !== null && response.success && response.data.clinics) {

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
					FlashService.Error("Error in finding clinic. Please use correct postalcode.");
				}
				vm.dataLoading = false;
			});
        }
		
		vm.viewDetail = function(clinicId) {
			vm.dataLoading = true;
			Booking.FindBookingByClinicIdAndStatus(clinicId,"waiting").then(function (booking) {
				if (booking !== null && booking.success) {
					var lastIndex = booking.data.length;
					var lastQno = 0;
					var estimatedTime = 0;
					if(lastIndex != 0){
						lastQno = booking.data[lastIndex-1].queNo;
						
					}
					estimatedTime = (lastQno * 5) + 5;
					$scope.estimatedTimeStr = "Estimated waiting time is "+ estimatedTime.toString() +" min(s)."
				}
			});
			Clinic.FindClinicById(clinicId)
				.then(function (response) {
					if (response !== null && response.success) {
							
						$scope.hideSearchResult = true;
						$scope.hideDetailResult = false;
						$scope.map.setCenter(new google.maps.LatLng(response.data.location[0],response.data.location[1]));
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
                if (response != null && response.success) {
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
				"_clinicId":$scope.mdata.clinic._id,
				"_userId":loggedIn.id,
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
		$scope.geoCoder = new google.maps.Geocoder();
	  
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
    function getLatLongText(){
    	return new Promise(function(resolve, reject) {
        	navigator.geolocation.getCurrentPosition(function(position) {
				resolve(position.coords.latitude+" "+ position.coords.longitude); 		
			});
        });
    }
    function isMobile() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

})();
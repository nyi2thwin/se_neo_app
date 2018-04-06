(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', '$http', '$filter', '$location','$rootScope','FlashService'];
    function homeController($scope, $http, $filter, $location,$rootScope,FlashService) {
		var vm = this;
		//Test Data
		var cities = [
              {
                  city : 'India',
                  desc : 'This is the best country in the world!',
                  lat : 23.200000,
                  long : 79.225487
              },
              {
                  city : 'New Delhi',
                  desc : 'The Heart of India!',
                  lat : 28.500000,
                  long : 77.250000
              },
              {
                  city : 'Mumbai',
                  desc : 'Bollywood city!',
                  lat : 19.000000,
                  long : 72.90000
              },
              {
                  city : 'Kolkata',
                  desc : 'Howrah Bridge!',
                  lat : 22.500000,
                  long : 88.400000
              },
              {
                  city : 'Chennai  ',
                  desc : 'Kathipara Bridge!',
                  lat : 13.000000,
                  long : 80.250000
              }
          ];
		$scope.hideSearchBox = true;
		$scope.hideSearchResult = true;
		$scope.hideDetailResult = true;
		var loggedIn = $rootScope.globals.currentUser;
		if(!loggedIn){
			$rootScope.isGuest = true;
		}
		else{
			$rootScope.isGuest = false;
		}
		var findNearByClinicURL = "http://localhost:3000/getNearByClinic/"+vm.postalCode;
		var findBookingByClinicIdURL = "http://localhost:3000/findBookingByClinicId";
		var bookURL = "http://localhost:3000/book";
		$scope.mdata ={};
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
			$scope.hideSearchResult = true;
			$scope.hideDetailResult = false;
			$scope.mdata.clinic = clinic;
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
                  zoom: 10,
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
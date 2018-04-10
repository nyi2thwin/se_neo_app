(function () {
    'use strict';

    angular
        .module('app')
        .factory('Booking', Booking);

    Booking.$inject = ['$rootScope','$http','$filter'];
    function Booking($rootScope,$http,$filter) {
        var service = {};
		var findBookingByClinicIdURL = "http://localhost:3000/findBookingByClinicId";
		var createBookingURL = "http://localhost:3000/createBooking";

        service.MakeAppointment = MakeAppointment;
        return service;
		
		
        function MakeAppointment(userId,clinicId,callback){
			var response;
			findBookingByClinicId(clinicId).then(function (booking) {
				if (booking !== null) {
					var lastIndex = booking.length;
					var lastQno = 0;
					var estimatedTime = 0;
					if(lastIndex != 0){
						lastQno = booking[lastIndex-1].queNo;
						estimatedTime = lastQno * 5 ;
					}
					
					var currentDate =  $filter('date')(new Date(), "MM-dd-yyyy");
					var newQno = lastQno + 1;
					

					//prepare data obj
					var data =
					{
						"userId": userId,
						"clinicId":clinicId,
						"dateTime":currentDate,
						"queNo":newQno,
						"status":"waiting",
						"estimatedTime":estimatedTime
					}
					
					//createNewBooking
					createBooking(data).then(function (newBooking) {
						if(newBooking !== null && newBooking._id) {
							var msg = ". Please proceed to to clinic in 5 min(s). Clinic is right to cancel booking for not showing up in time."; 
						
							response = handleResponse("Appointment Successful.Your Quno is "+newQno.toString()+". Estimated Time is "+estimatedTime.toString()+" min(s)"+msg , true);
							
						} else {
							response = newBooking;
						}
						
						callback(response);
					
					});

				} else {
					response = { success: false, message: 'Error Making Appointment' };
				}
				callback(response);
			});
        }
		
		function findBookingByClinicId(clinicId) {
			 var dataToSend = 
			{
				"clinicId":clinicId,  //$scope.mdata.clinic._id,
			};    
			
            return $http.post(findBookingByClinicIdURL,dataToSend).then(handleSuccess, handleError('Error getting Booking by ClinicId'));
        }
		
		
		function createBooking(booking) {
		    return $http.post(createBookingURL,booking).then(handleSuccess, handleError('Error creating Booking'));
        }

		function handleResponse(msg , status) {
            return { success: status, message:msg };
        }
		
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

    }

})();
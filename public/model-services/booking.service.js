(function () {
    'use strict';

    angular
        .module('app')
        .factory('Booking', Booking);

    Booking.$inject = ['$rootScope','$http','$filter'];
    function Booking($rootScope,$http,$filter) {
        var service = {};
		var findBookingByClinicIdURL = "http://localhost:3000/findBookingByClinicId";
		var findBookingByUserIdURL = "http://localhost:3000/findBookingByUserId";
		var createBookingURL = "http://localhost:3000/createBooking";
		var deleteBookingURL = "http://localhost:3000/deleteBooking";
		var MarkVisitedURL = "http://localhost:3000/markVisited";
		var sendNotification = "http://localhost:3000/sendNotification";
		var findBookingByUserIdAndStatus = "http://localhost:3000/findBookingByUserIdAndStatus";

        service.MakeAppointment = MakeAppointment;
		service.Create = Create;
		service.Delete = Delete;
		service.Notify = Notify;
		service.FindBookingByUserId = FindBookingByUserId;
		service.FindBookingByClinicId = FindBookingByClinicId;
		service.FindUserCurrentAppointment = FindUserCurrentAppointment;
		service.FindUserAppointHistory = FindUserAppointHistory;
		service.MarkVisited = MarkVisited;
        return service;
		
		
        function MakeAppointment(userId,clinicId,callback){
			var response;
			FindBookingByClinicId(clinicId).then(function (booking) {
				if (booking !== null && booking.success) {
					var lastIndex = booking.data.length;
					var lastQno = 0;
					var estimatedTime = 0;
					if(lastIndex != 0){
						lastQno = booking.data[lastIndex-1].queNo;
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
					Create(data).then(function (newBooking) {
						if(newBooking !== null && newBooking.success) {
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
				
			});
        }
		
		
		function FindBookingByClinicId(clinicId) {
			 var dataToSend = {"clinicId":clinicId};    
			
            return $http.post(findBookingByClinicIdURL,dataToSend).then(handleSuccess, handleError('Error getting Booking by ClinicId'));
        }
		
		function FindBookingByUserId(userId) {
			 var dataToSend = {"userId":userId};    
			
            return $http.post(findBookingByUserIdURL,dataToSend).then(handleSuccess, handleError('Error getting Booking by UserId'));
        }
				
		function FindUserCurrentAppointment(userId) {
			 var dataToSend = {"userId":userId, "status":"waiting"};    
			
            return $http.post(findBookingByUserIdAndStatus,dataToSend).then(handleSuccess, handleError('Error getting user current booking'));
		}
		
		function FindUserAppointHistory(userId) {
			 var dataToSend = {"userId":userId, "status":"visited"};    
			
            return $http.post(findBookingByUserIdAndStatus,dataToSend).then(handleSuccess, handleError('Error getting user appoint history'));
		}
		
		function Create(booking) {
		    return $http.post(createBookingURL,booking).then(handleSuccess, handleError('Error creating Booking'));
        }
		
		function Delete(bookingId) {
			var dataToSend = {"bookingId":bookingId};  
		    return $http.post(deleteBookingURL,dataToSend).then(handleSuccess, handleError('Error deleting Booking'));
        }

        function MarkVisited(bookingId) {
			var dataToSend = {"bookingId":bookingId};  
		    return $http.post(MarkVisitedURL,dataToSend).then(handleSuccess, handleError('Error marking visisted'));
        }
		
		function Notify(bookingId) {
			var dataToSend = {"bookingId":bookingId};  
		    return $http.post(sendNotification,dataToSend).then(handleSuccess, handleError('Error Sending Notification Message to your phone!'));
        }

		function handleResponse(msg , status) {
            return { success: status, message:msg };
        }
		
        function handleSuccess(res) {
            return { success: true, data: res.data };
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

    }

})();
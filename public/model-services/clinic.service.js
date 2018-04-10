(function () {
    'use strict';

    angular
        .module('app')
        .factory('ClinicService', ClinicService);

    ClinicService.$inject = ['$rootScope','$http','$filter'];
    function ClinicService($rootScope,$http,$filter) {
        var service = {};
	
        service.GetNearByClinic = GetNearByClinic;
		service.FindClinicById = FindClinicById;
		service.AddReview = AddReview;
        return service;
		
		function GetNearByClinic(postalCode) {
			return $http.get("http://localhost:3000/getNearByClinic/" + postalCode).then(handleSuccess, handleError('Error getting nearby clinics'));
		}

		function FindClinicById(clinicId) {
			 var dataToSend = 
			{
				"clinicId":clinicId,
			};
			return $http.post("http://localhost:3000/findClinicById", dataToSend).then(handleSuccess, handleError('Error finding clinic by Id'));
		}
		
		function AddReview(dataToSend) {
			return $http.post("http://localhost:3000/addReview", dataToSend).then(handleSuccess, handleError('Error finding clinic by Id'));
		}
		
		//Private Methods
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
(function () {
    'use strict';

    angular
        .module('app')
        .factory('Clinic', Clinic);

    Clinic.$inject = ['$rootScope','$http','$filter'];
    function Clinic($rootScope,$http,$filter) {
        var service = {};
	
        service.GetNearByClinic = GetNearByClinic;
		service.FindClinicById = FindClinicById;
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
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
		service.Update = Update;
		
	    return service;
		
		function GetNearByClinic(postalCode) {
			return $http.get("/getNearByClinic/" + postalCode).then(handleSuccess, handleError('Error getting nearby clinics'));
		}

		function FindClinicById(clinicId) { 
			 var dataToSend = 
			{
				"clinicId":clinicId,
			};
			return $http.post("/findClinicById", dataToSend).then(handleSuccess, handleError('Error finding clinic by Id'));
		}
		function Update(clinic) {
			return $http.post("/updateClinic", clinic).then(handleSuccess, handleError('Error updating clinic info'));
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
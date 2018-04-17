(function () {
    'use strict';

    angular
        .module('app')
        .factory('Review', Review);

    Review.$inject = ['$rootScope','$http'];
    function Review($rootScope,$http) {
        var service = {};
		service.AddReview = AddReview;
        return service;
		
		function AddReview(dataToSend) {
			return $http.post("/addReview", dataToSend).then(handleSuccess, handleError('Error finding clinic by Id'));
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
(function () {
    'use strict';

    angular
        .module('app')
        .factory('User', User);

    User.$inject = ['$http'];
    function User($http) {
        var service = {};

        service.GetByNric = GetByNric;
        service.Create = Create;
		service.Update = Update;
		service.ResetPasswordByEmail = ResetPasswordByEmail;
     

        return service;

        function GetByNric(nric) {
			var nric = {"nric":nric};
            return $http.post("/findUserByNric",nric).then(handleSuccess, handleError('Error getting user by id'));
        }

        function Create(user) {
            return $http.post("/register", user).then(handleSuccess, handleError('Error creating user'));
        }
		
		function Update(user) {
            return $http.post("/updateUser", user).then(handleSuccess, handleError('Error updating user'));
        }
		
		function ResetPasswordByEmail(email) {
			var id = {"email":email};
			return $http.post("/resetPasswordByEmail",id).then(handleSuccess, handleError('Error Reseting Password'));
		}
        // private functions 

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

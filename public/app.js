(function () {
    'use strict';

    angular
		.module('app', ['ngRoute', 'ngCookies','ngMaterial','jkAngularRatingStars'])
		.config(config)
		.run(run);

	config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/listPatient', {
                controller: 'patientListController',
                templateUrl: 'clinic/patientList.html',
                controllerAs: 'vm'
            })
			.when('/viewMyClinicInfo', {
                controller: 'viewMyClinicInfoController',
                templateUrl: 'clinic/viewMyClinicInfo.html',
                controllerAs: 'vm'
            })
			.when('/viewMyClinicReviews', {
                controller: 'viewMyClinicReviewsController',
                templateUrl: 'clinic/viewMyClinicReviews.html',
                controllerAs: 'vm'
            })
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })
			.when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })
			.when('/home', {
                controller: 'homeController',
                templateUrl: 'home/home.html',
                controllerAs: 'vm'
            })
			.when('/viewMyInfo', {
                controller: 'viewMyInfoController',
                templateUrl: 'member/viewMyInfo.html',
                controllerAs: 'vm'
            })
			.when('/viewHistory', {
                controller: 'viewAppointmentHistoryController',
                templateUrl: 'member/viewAppointmentHistory.html',
                controllerAs: 'vm'
            }).when('/admin', {
                controller: 'AdminController',
                templateUrl: 'admin/admin.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http'];
    function run($rootScope, $location, $cookies, $http) {
		$rootScope.loggedIn = false;
		$rootScope.isClinic = false;
		$rootScope.isGuest = false;
		
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
	
		if ($rootScope.globals.currentUser) {
			$rootScope.loggedIn = true;
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }
		
		var init = function(){
                 $('#sidebarCollapse').on('click', function () {
                    $('#sidebar, #content').toggleClass('active');
                    $('.collapse.in').toggleClass('in');
                    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
                });
				
				
		};
		
		$rootScope.logout = function(){
			$rootScope.globals = {};
			$rootScope.userName = "";
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
			$rootScope.isClinic = false;
			$rootScope.isGuest = false;
			$rootScope.loggedIn = false;
			$location.path('/login');
		}
		init();

       $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register','/home','/admin']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
			
		    if (restrictedPage && !loggedIn) {
                $location.path('/login');
				$rootScope.isClinic = false;
				$rootScope.isGuest = false;
            }
			else if (!restrictedPage && loggedIn) {
				$rootScope.loggedIn = true;
				isClinicAdmin();
	        }
						
        });
		
		var isClinicAdmin = function(){
			if ($rootScope.isClinic){
				$location.path('/listPatient');
			}
			else{
				$location.path('/home');
			}
		}

    }

})();

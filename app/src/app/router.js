(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

	routeConfig.$inject = ['$stateProvider','$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
	
		function resolver(paramDate) {
			getHoroscope.$inject =['$rootScope', '$http', '$stateParams', 'ShowService'];
			function getHoroscope($rootScope, $http, $stateParams, ShowService) {
				var webUrl = $rootScope.myConfig.webUrl;
				var d = new Date;
				var todayDate = d.getMonth() + 1 + '/' + (d.getDate()) + '/' + d.getFullYear();
				var signName = $stateParams.signName;
				var param = "&sign=" + signName + "&date=" + ShowService.paramDate(paramDate);
				var url = webUrl + param + '&callback=JSON_CALLBACK';
				return $http.jsonp(url)
					.then(function (result) {
						var details = result.data[0].details.scope;
						details = details.replace(/’/g, "'");
						return details;
					})
					.catch(function() {
					});
			}
			return getHoroscope;
		}
						
        $urlRouterProvider.otherwise('/main');
		
        $stateProvider
		    .state('main', {
                url: '/main',
				templateUrl: 'app/main.html',
				controller: 'MainCtrl',
				controllerAs: 'mainCtrl',
                data: {
                    requireLogin: false
                }
            })
			
            .state('signs', {
                url: '/signs',
                templateUrl: 'signs/signs.html',
                controller: 'SignsCtrl',
                controllerAs: 'signsCtrl',
                data: {
                    requireLogin: false
                }
            })

            .state('show-today', {
                url: '/show-today?signName?friends',
                templateUrl: 'show/show-today.html',
                controller: 'ShowTodayCtrl',
                controllerAs: 'showTodayCtrl',
                data: {
                    requireLogin: false
                },
				resolve: {
					today: resolver('today')
				}
            })

            .state('show-yesterday', {
                url: '/show-yesterday?signName?friends',
                templateUrl: 'show/show-yesterday.html',
                controller: 'ShowYesterdayCtrl',
                controllerAs: 'showYesterdayCtrl',
                data: {
                    requireLogin: false
                },
				resolve: {
					yesterday: resolver('yesterday')
				}
            })

            .state('show-tomorrow', {
                url: '/show-tomorrow?signName?friends',
                templateUrl: 'show/show-tomorrow.html',
                controller: 'ShowTomorrowCtrl',
                controllerAs: 'showTomorrowCtrl',
                data: {
                    requireLogin: false
                },
				resolve: {
					tomorrow: resolver('tomorrow')
				}
            })
			
            .state('friends', {
                url: '/friends',
				templateUrl: 'friends/friends.html',
				controller: 'FriendsCtrl',
				controllerAs: 'friendsCtrl'  
            })
			
            .state('users', {
                url: '/users',
				templateUrl: 'users/users.html',
				controller: 'UsersCtrl',
				controllerAs: 'usersCtrl'  
            })

            .state('users-add', {
                url: '/users-add',
                params: {item:{}},
				templateUrl: 'users/users-add.html',
				controller: 'UsersAddCtrl',
				controllerAs: 'usersAddCtrl'
            })
			
			.state('users-edit', {
                url: '/users-edit',
                params: {item:{}},
				templateUrl: 'users/users-edit.html',
				controller: 'UsersEditCtrl',
				controllerAs: 'usersEditCtrl'
            })

            .state('users-dialog', {
                url: '/users-dialog',
                params: {item:{}},
				templateUrl: 'users/users-dialog.html',
				controller: 'UsersDialogCtrl',
				controllerAs: 'usersDialogCtrl'
            })
    }
})();
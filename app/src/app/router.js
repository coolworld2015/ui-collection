(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

	routeConfig.$inject = ['$stateProvider','$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {
	
		function resolveResource(url, state ,sort) {
			resolver.$inject = ['$http', '$q', '$rootScope', 'ClientsLocalStorage'];
			function resolver($http, $q, $rootScope, ClientsLocalStorage) {
				var data;
				if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
					if (state == 'clients') {
						data = ClientsLocalStorage.getClients();
						return data;
					}
				}
				var webUrl = $rootScope.myConfig.webUrl + url;
				return $http.get(webUrl)
                    .then(function (result) {
                        $rootScope.loading = false;
                        return result.data.sort(sort);
                    })
                    .catch(function (reject) {
                        $rootScope.loading = false;
                        $rootScope.myError = true;
                        return $q.reject(reject);
                    });
			}

			return resolver;
		}
		
		function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }

        function sort1(a, b) {
            return parseInt(a.number) - parseInt(b.number);
        }
		
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
			
            .state('clients', {
                url: '/clients',
				templateUrl: 'clients/clients.html',
				controller: 'ClientsCtrl',
				controllerAs: 'clientsCtrl',
                resolve: {
                    clients: resolveResource('api/clients/get', 'clients', sort)
                }
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
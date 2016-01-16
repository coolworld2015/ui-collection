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
								
        $urlRouterProvider.otherwise('/main');
		
        $stateProvider
		    .state('main', {
                url: '/main',
				templateUrl: 'app/main.html',
				controller: 'MainCtrl',
				controllerAs: 'mainCtrl'
            })
			
            .state('config', {
                url: '/config',
				templateUrl: 'config/config.html',
				controller: 'ConfigCtrl',
				controllerAs: 'configCtrl'
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
				
            .state('clients-add', {
                url: '/clients-add',
                params: {item:{}},
				templateUrl: 'clients/clients-add.html',
				controller: 'ClientsAddCtrl',
				controllerAs: 'clientsAddCtrl'
            })
			
			.state('clients-edit', {
                url: '/clients-edit',
                params: {item:{}},
				templateUrl: 'clients/clients-edit.html',
				controller: 'ClientsEditCtrl',
				controllerAs: 'clientsEditCtrl'
            })

            .state('clients-dialog', {
                url: '/clients-dialog',
                params: {item:{}},
				templateUrl: 'clients/clients-dialog.html',
				controller: 'ClientsDialogCtrl',
				controllerAs: 'clientsDialogCtrl'
            })
    }
})();
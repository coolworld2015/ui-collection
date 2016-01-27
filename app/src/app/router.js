(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {

        function resolveResource(url, state, sort) {
            resolver.$inject = ['$http', '$q', '$rootScope', 'ClientsLocalStorage', 'CategoriesLocalStorage',
                'GroupsLocalStorage', 'ItemsLocalStorage',
				'ClientsService', 'CategoriesService', 'GroupsService', 'ItemsService'];
            function resolver($http, $q, $rootScope, ClientsLocalStorage, CategoriesLocalStorage,
                              GroupsLocalStorage, ItemsLocalStorage,
							  ClientsService, CategoriesService, GroupsService, ItemsService) {
                var data;

                if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                    switch (state) {
                        case 'clients':
                            data = ClientsLocalStorage.getClients();
                            return data;
                            break;

                        case 'categories':
                            data = CategoriesLocalStorage.getCategories();
                            return data;
                            break;

                        case 'groups':
                            data = GroupsLocalStorage.getGroups();
                            return data;
                            break;

                        case 'items':
                            data = ItemsLocalStorage.getItems();
                            return data;
                            break;
                    }
                } else {
					switch (state) {
                        case 'clients':
							if ($rootScope.clients === undefined) {
								var webUrl = $rootScope.myConfig.webUrl + url;
								return $http.get(webUrl)
									.then(function (result) {
										ClientsService.clients = result.data;
										$rootScope.clients = true;
										$rootScope.loading = false;
										return ClientsService.clients.sort(sort);
									})						
									.catch(function (reject) {
										$rootScope.loading = false;
										$rootScope.myError = true;
										return $q.reject(reject);
									});	
							} else {
								return ClientsService.clients.sort(sort);
							}
                            break;

                        case 'categories':
                            if ($rootScope.categories === undefined) {
                                var webUrl = $rootScope.myConfig.webUrl + url;
                                return $http.get(webUrl)
                                    .then(function (result) {
                                        CategoriesService.categories = result.data;
                                        $rootScope.categories = true;
                                        $rootScope.loading = false;
                                        return CategoriesService.categories.sort(sort);
                                    })
                                    .catch(function (reject) {
                                        $rootScope.loading = false;
                                        $rootScope.myError = true;
                                        return $q.reject(reject);
                                    });
                            } else {
                                return CategoriesService.categories.sort(sort);
                            }
                            break;

                        case 'groups':
                            if ($rootScope.groups === undefined) {
                                var webUrl = $rootScope.myConfig.webUrl + url;
                                return $http.get(webUrl)
                                    .then(function (result) {
                                        GroupsService.groups = result.data;
                                        $rootScope.groups = true;
                                        $rootScope.loading = false;
                                        return GroupsService.groups.sort(sort);
                                    })
                                    .catch(function (reject) {
                                        $rootScope.loading = false;
                                        $rootScope.myError = true;
                                        return $q.reject(reject);
                                    });
                            } else {
                                return GroupsService.groups.sort(sort);
                            }
                            break;

                        case 'items':
                            if ($rootScope.items === undefined) {
                                var webUrl = $rootScope.myConfig.webUrl + url;
                                return $http.get(webUrl)
                                    .then(function (result) {
                                        ItemsService.items = result.data;
                                        $rootScope.items = true;
                                        $rootScope.loading = false;
                                        return ItemsService.items.sort(sort);
                                    })
                                    .catch(function (reject) {
                                        $rootScope.loading = false;
                                        $rootScope.myError = true;
                                        return $q.reject(reject);
                                    });
                            } else {
                                return ItemsService.items.sort(sort);
                            }
                            break;
                    }
				}
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

        function sortNumber(a, b) {
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
//-------------------------------------------------------------------------------------------------------
            .state('search', {
                url: '/search',
                templateUrl: 'search/search.html',
                controller: 'SearchCtrl',
                controllerAs: 'searchCtrl'
            })

            .state('search-results', {
                url: '/search-results?name?search?finds',
                templateUrl: 'search/search-results.html',
                controller: 'SearchResultsCtrl',
                controllerAs: 'searchResultsCtrl',
                resolve: {
                    items: ['$http', '$stateParams', '$rootScope', 'ItemsLocalStorage',
                        function ($http, $stateParams, $rootScope, ItemsLocalStorage) {
                            var name = $stateParams.name;
                            if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                                var data = ItemsLocalStorage.findByName(name);
                                return data;
                            } else {
                                var api = 'api/items/findByName/';
                                var webUrl = $rootScope.myConfig.webUrl + api;
                                return $http.get(webUrl + name)
                                    .then(function (data) {
                                        return data.data;
                                    })
                                    .catch(function () {
                                        $rootScope.loading = false;
                                        $rootScope.error = true;
                                        return [];
                                    });
                            }
                        }]
                }
            })
//-------------------------------------------------------------------------------------------------------
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
                params: {item: {}},
                templateUrl: 'clients/clients-add.html',
                controller: 'ClientsAddCtrl',
                controllerAs: 'clientsAddCtrl'
            })

            .state('clients-edit', {
                url: '/clients-edit',
                params: {item: {}},
                templateUrl: 'clients/clients-edit.html',
                controller: 'ClientsEditCtrl',
                controllerAs: 'clientsEditCtrl'
            })

            .state('clients-dialog', {
                url: '/clients-dialog',
                params: {item: {}},
                templateUrl: 'clients/clients-dialog.html',
                controller: 'ClientsDialogCtrl',
                controllerAs: 'clientsDialogCtrl'
            })
//-------------------------------------------------------------------------------------------------------
            .state('categories', {
                url: '/categories',
                templateUrl: 'categories/categories.html',
                controller: 'CategoriesCtrl',
                controllerAs: 'categoriesCtrl',
                resolve: {
                    categories: resolveResource('api/categories/get', 'categories', sort)
                }
            })

            .state('categories-add', {
                url: '/categories-add',
                params: {item: {}},
                templateUrl: 'categories/categories-add.html',
                controller: 'CategoriesAddCtrl',
                controllerAs: 'categoriesAddCtrl'
            })

            .state('categories-edit', {
                url: '/categories-edit',
                params: {item: {}},
                templateUrl: 'categories/categories-edit.html',
                controller: 'CategoriesEditCtrl',
                controllerAs: 'categoriesEditCtrl'
            })

            .state('categories-dialog', {
                url: '/categories-dialog',
                params: {item: {}},
                templateUrl: 'categories/categories-dialog.html',
                controller: 'CategoriesDialogCtrl',
                controllerAs: 'categoriesDialogCtrl'
            })
//-------------------------------------------------------------------------------------------------------
            .state('groups', {
                url: '/groups',
                templateUrl: 'groups/groups.html',
                controller: 'GroupsCtrl',
                controllerAs: 'groupsCtrl',
                resolve: {
                    groups: resolveResource('api/groups/get', 'groups', sort)
                }
            })

            .state('groups-add', {
                url: '/groups-add',
                params: {item: {}},
                templateUrl: 'groups/groups-add.html',
                controller: 'GroupsAddCtrl',
                controllerAs: 'groupsAddCtrl',
                resolve: {
                    categories: resolveResource('api/categories/get', 'categories', sort)
                }
            })

            .state('groups-edit', {
                url: '/groups-edit',
                params: {item: {}},
                templateUrl: 'groups/groups-edit.html',
                controller: 'GroupsEditCtrl',
                controllerAs: 'groupsEditCtrl'
            })

            .state('groups-dialog', {
                url: '/groups-dialog',
                params: {item: {}},
                templateUrl: 'groups/groups-dialog.html',
                controller: 'GroupsDialogCtrl',
                controllerAs: 'groupsDialogCtrl'
            })
//-------------------------------------------------------------------------------------------------------
            .state('items', {
                url: '/items',
                templateUrl: 'items/items.html',
                controller: 'ItemsCtrl',
                controllerAs: 'itemsCtrl',
                resolve: {
                    items: resolveResource('api/items/get', 'items', sort)
                }
            })

            .state('items-add', {
                url: '/items-add',
                params: {item: {}},
                templateUrl: 'items/items-add.html',
                controller: 'ItemsAddCtrl',
                controllerAs: 'itemsAddCtrl',
                resolve: {
                    categories: resolveResource('api/categories/get', 'categories', sort),
                    groups: resolveResource('api/groups/get', 'groups', sort)
                }
            })

            .state('items-edit', {
                url: '/items-edit?finds',
                params: {item: {}},
                templateUrl: 'items/items-edit.html',
                controller: 'ItemsEditCtrl',
                controllerAs: 'itemsEditCtrl'
            })

            .state('items-dialog', {
                url: '/items-dialog',
                params: {item: {}},
                templateUrl: 'items/items-dialog.html',
                controller: 'ItemsDialogCtrl',
                controllerAs: 'itemsDialogCtrl'
            });
//-------------------------------------------------------------------------------------------------------
    }
})();
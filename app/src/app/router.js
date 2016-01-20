(function () {
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routeConfig($stateProvider, $urlRouterProvider) {

        function resolveResource(url, state, sort) {
            resolver.$inject = ['$http', '$q', '$rootScope', 'ClientsLocalStorage', 'CategoriesLocalStorage',
                'GroupsLocalStorage', 'ItemsLocalStorage'];
            function resolver($http, $q, $rootScope, ClientsLocalStorage, CategoriesLocalStorage,
                              GroupsLocalStorage, ItemsLocalStorage) {
                var data;
                if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                    if (state == 'clients') {
                        data = ClientsLocalStorage.getClients();
                        return data;
                    }
                }
                if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                    if (state == 'categories') {
                        data = CategoriesLocalStorage.getCategories();
                        return data;
                    }
                }
                if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                    if (state == 'groups') {
                        data = GroupsLocalStorage.getGroups();
                        return data;
                    }
                }
                if ($rootScope.mode == 'OFF-LINE (LocalStorage)') {
                    if (state == 'items') {
                        data = ItemsLocalStorage.getItems();
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

        //function sort1(a, b) {
        //    return parseInt(a.number) - parseInt(b.number);
        //}

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
                controllerAs: 'groupsAddCtrl'
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
                controllerAs: 'itemsAddCtrl'
            })

            .state('items-edit', {
                url: '/items-edit',
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
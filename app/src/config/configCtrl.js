(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfigCtrl', ConfigCtrl);

    ConfigCtrl.$inject = ['$scope', '$rootScope', '$state', '$http', 'ClientsLocalStorage', 'ItemsLocalStorage'];

    function ConfigCtrl($scope, $rootScope, $state, $http, ClientsLocalStorage, ItemsLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            toggleMode: toggleMode,
            doAction: doAction,
            _getAllHeroku: getAllHeroku,
            _getClientsHeroku: getClientsHeroku,
            _getItemsHeroku: getItemsHeroku,
            _loading: loading,
            _error: error,
            _complete: complete,
            toMain: toMain
        });

        init();

        function init() {
            vm.webUrl = $rootScope.myConfig.webUrl;
            vm.mode = $rootScope.mode;
            $rootScope.myError = false;
            $rootScope.loading = false;

            vm.options = [
                {name: 'Select transaction', value: 'none'},
                {name: 'Get all transactions', value: 'heroku.get.all'},
                {name: 'Get contacts (Heroku)', value: 'heroku.clients.get'},
                {name: 'Get items (Heroku)', value: 'heroku.items.get'}
            ];
            vm.selectedItem = vm.options[0];
        }

        function toggleMode() {
            if (vm.mode == 'OFF-LINE (LocalStorage)') {
                vm.mode = 'ON-LINE (Heroku)';
                $rootScope.mode = 'ON-LINE (Heroku)';
            } else {
                vm.mode = 'OFF-LINE (LocalStorage)';
                $rootScope.mode = 'OFF-LINE (LocalStorage)';
            }
            localStorage.setItem('ui-collection.mode', JSON.stringify(vm.mode));
            toMain();
        }

        function doAction() {
            loading();

            switch (vm.selectedItem.value) {
                case 'none':
                {
                    error();
                    break;
                }

                case 'heroku.get.all':
                {
                    getAllHeroku();
                    break;
                }

                case 'heroku.clients.get':
                {
                    getClientsHeroku();
                    break;
                }

                case 'heroku.items.get':
                {
                    getItemsHeroku();
                    break;
                }
            }
        }

        function getAllHeroku() {
            $rootScope.loading = true;
            var url = vm.webUrl + 'api/items/get';
            $http.get(url)
                .then(function (results) {
                    try {
                        ItemsLocalStorage.uploadItems(results.data);

                        var url = vm.webUrl + 'api/clients/get';
                        $http.get(url)
                            .then(function (results) {
                                try {
                                    ClientsLocalStorage.uploadClients(results.data);
                                    complete();
                                    $rootScope.loading = false;
                                } catch (e) {
                                    error();
                                    alert(e);
                                }
                            })
                            .catch(function (data) {
                                error();
                                $rootScope.loading = false;
                            });
                    } catch (e) {
                        error();
                        alert(e);
                    }
                })
                .catch(function (data) {
                    error();
                    $rootScope.loading = false;
                });
        }

        function getClientsHeroku() {
            $rootScope.loading = true;
            var url = vm.webUrl + 'api/clients/get';
            $http.get(url)
                .then(function (results) {
                    try {
                        ClientsLocalStorage.uploadClients(results.data);
                        complete();
                        $rootScope.loading = false;
                    } catch (e) {
                        error();
                        alert(e);
                    }
                })
                .catch(function (data) {
                    error();
                    $rootScope.loading = false;
                });
        }

        function getItemsHeroku() {
            $rootScope.loading = true;
            var url = vm.webUrl + 'api/items/get';
            $http.get(url)
                .then(function (results) {
                    try {
                        ItemsLocalStorage.uploadItems(results.data);
                        complete();
                        $rootScope.loading = false;
                    } catch (e) {
                        error();
                        alert(e);
                    }
                })
                .catch(function (data) {
                    error();
                    $rootScope.loading = false;
                });
        }

        function loading() {
            $scope.$broadcast('scrollThere');
            vm.complete = false;
            vm.error = false;
            vm.loading = true;
        }

        function error() {
            vm.complete = false;
            vm.loading = false;
            $rootScope.loading = false;
            $rootScope.myError = true;
        }

        function complete() {
            vm.error = false;
            vm.loading = false;
            vm.complete = true;
        }

        function toMain() {
            $state.go('main');
        }
    }
})();


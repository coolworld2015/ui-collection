(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsDialogCtrl', ItemsDialogCtrl);

    ItemsDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'ItemsService', 'ItemsLocalStorage', '$stateParams'];

    function ItemsDialogCtrl($state, $rootScope, $timeout, ItemsService, ItemsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            itemsDelete: itemsDelete,
            itemsEditBack: itemsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        function itemsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ItemsService.deleteItem(vm.id)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('items');
                    })
                    .catch(errorHandler);
            } else {
                ItemsLocalStorage.deleteItem(vm.id);
                $state.go('items');
            }
        }

        function itemsEditBack() {
            $rootScope.loading = true;
            $state.go('items');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
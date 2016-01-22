(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoriesDialogCtrl', CategoriesDialogCtrl);

    CategoriesDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'CategoriesService', 'CategoriesLocalStorage', '$stateParams'];

    function CategoriesDialogCtrl($state, $rootScope, $timeout, CategoriesService, CategoriesLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            categoriesDelete: categoriesDelete,
            categoriesEditBack: categoriesEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
            $rootScope.loading = false;
        });

        function categoriesDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                CategoriesService.deleteItem(vm.id)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('categories');
                    })
                    .catch(errorHandler);
            } else {
                CategoriesLocalStorage.deleteItem(vm.id);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('categories');
                }, 100);
            }
        }

        function categoriesEditBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('categories');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
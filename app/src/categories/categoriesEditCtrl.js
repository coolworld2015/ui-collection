(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoriesEditCtrl', CategoriesEditCtrl);

    CategoriesEditCtrl.$inject = ['$state', '$rootScope', '$timeout', 'CategoriesService', 'CategoriesLocalStorage', '$stateParams'];

    function CategoriesEditCtrl($state, $rootScope, $timeout, CategoriesService, CategoriesLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            categoriesSubmit: categoriesSubmit,
            categoriesDialog: categoriesDialog,
            categoriesEditBack: categoriesEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function categoriesSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.loading = true;
            $rootScope.myError = false;

            var item = {
                id: vm.id,
                name: vm.name,
                groups: vm.groups,
                description: vm.description
            };
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                CategoriesService.editItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('categories');
                    })
                    .catch(errorHandler);
            } else {
                CategoriesLocalStorage.editItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('categories');
                }, 100);
            }
        }

        function categoriesDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('categories-dialog', {item: obj});
            }, 100);
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
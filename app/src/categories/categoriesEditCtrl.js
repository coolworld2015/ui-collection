(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoriesEditCtrl', CategoriesEditCtrl);

    CategoriesEditCtrl.$inject = ['$state', '$rootScope', '$timeout', 'CategoriesService', 'CategoriesLocalStorage', '$stateParams'];

    function CategoriesEditCtrl($state, $rootScope, $timeout, CategoriesService, CategoriesLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            categoriesSubmit: categoriesSubmit,
            categoriesDialog: categoriesDialog,
            categoriesEditBack: categoriesEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
        });

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
                $state.go('categories');
            }
        }

        function categoriesDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('categories-dialog', {item: obj});
        }

        function categoriesEditBack() {
            $rootScope.loading = true;
            $state.go('categories');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
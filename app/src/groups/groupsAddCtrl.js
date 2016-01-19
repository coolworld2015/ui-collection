(function () {
    'use strict';

    angular
        .module('app')
        .controller('GroupsAddCtrl', GroupsAddCtrl);

    GroupsAddCtrl.$inject = ['$state', '$rootScope', '$timeout', 'GroupsService', 'GroupsLocalStorage',
        'CategoriesLocalStorage'];

    function GroupsAddCtrl($state, $rootScope, $timeout, GroupsService, GroupsLocalStorage,
                           CategoriesLocalStorage) {
        var optionalClient = {name: 'Select customer'};
        var vm = this;

        angular.extend(vm, {
            init: init,
            updateChange: updateChange,
            groupsAddSubmit: groupsAddSubmit,
            groupsAddBack: groupsAddBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.clients = CategoriesLocalStorage.getCategories();
            vm.clientsOptions = [].concat(vm.clients);
            //vm.clientsOptions.unshift(optionalClient);
            $rootScope.loading = false;
        }

        function updateChange(item) {
            vm.error = false;
            vm.categoryName = item.name;
        }

        function groupsAddSubmit() {
            if (vm.selectedItem.name == 'Select customer') {
                vm.error = true;
                return;
            }

            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                name: vm.name,
                category: vm.categoryName,
                description: vm.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                GroupsService.addItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('groups');
                    })
                    .catch(errorHandler);
            } else {
                GroupsLocalStorage.addItem(item);
                $state.go('groups');
            }
        }

        function groupsAddBack() {
            $state.go('groups');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
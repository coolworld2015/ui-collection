(function () {
    'use strict';

    angular
        .module('app')
        .controller('GroupsAddCtrl', GroupsAddCtrl);

    GroupsAddCtrl.$inject = ['$state', '$rootScope', '$timeout', 'GroupsService', 'GroupsLocalStorage',
        'CategoriesLocalStorage'];

    function GroupsAddCtrl($state, $rootScope, $timeout, GroupsService, GroupsLocalStorage,
                           CategoriesLocalStorage) {
        var vm = this;
        var optionalCategory = {name: 'Select category'};

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
            vm.options = [].concat(vm.clients);
            vm.options.unshift(optionalCategory);
            vm.selectedItem = vm.options[0];
            $rootScope.loading = false;
        }

        function updateChange(item) {
            vm.error = false;
            vm.categoryName = item.name;
        }

        function groupsAddSubmit() {
            if (vm.selectedItem.name == 'Select category') {
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
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('groups');
                }, 100);
            }
        }

        function groupsAddBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('groups');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
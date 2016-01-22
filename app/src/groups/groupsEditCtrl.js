(function () {
    'use strict';

    angular
        .module('app')
        .controller('GroupsEditCtrl', GroupsEditCtrl);

    GroupsEditCtrl.$inject = ['$state', '$rootScope', '$timeout', 'GroupsService',
        'GroupsLocalStorage', '$stateParams'];

    function GroupsEditCtrl($state, $rootScope, $timeout, GroupsService,
                            GroupsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            groupsSubmit: groupsSubmit,
            groupsDialog: groupsDialog,
            groupsEditBack: groupsEditBack,
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

        function groupsSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.loading = true;
            $rootScope.myError = false;

            var item = {
                id: vm.id,
                name: vm.name,
                category: vm.category,
                description: vm.description
            };
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                GroupsService.editItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('groups');
                    })
                    .catch(errorHandler);
            } else {
                GroupsLocalStorage.editItem(item);
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('groups');
                }, 100);
            }
        }

        function groupsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('groups-dialog', {item: obj});
            }, 100);
        }

        function groupsEditBack() {
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
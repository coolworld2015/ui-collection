(function () {
    'use strict';

    angular
        .module('app')
        .controller('GroupsDialogCtrl', GroupsDialogCtrl);

    GroupsDialogCtrl.$inject = ['$state', '$rootScope', '$timeout', 'GroupsService', 'GroupsLocalStorage', '$stateParams'];

    function GroupsDialogCtrl($state, $rootScope, $timeout, GroupsService, GroupsLocalStorage, $stateParams) {
        var vm = this;

        angular.extend(vm, {
            groupsDelete: groupsDelete,
            groupsEditBack: groupsEditBack,
            _errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        function groupsDelete() {
            $rootScope.loading = true;
            $rootScope.myError = false;

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                GroupsService.deleteItem(vm.id)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('groups');
                    })
                    .catch(errorHandler);
            } else {
                GroupsLocalStorage.deleteItem(vm.id);
                $state.go('groups');
            }
        }

        function groupsEditBack() {
            $rootScope.loading = true;
            $state.go('groups');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
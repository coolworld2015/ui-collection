(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout'];

    function SearchCtrl($scope, $state, $rootScope, $timeout) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            searchSubmit: searchSubmit,
            searchBack: searchBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.options = [
                {name: 'Search by name'},
                {name: 'Search by category'},
                {name: 'Search by group'},
                {name: 'Search by description'}
            ];
            vm.selectedItem = vm.options[0];

            $rootScope.loading = false;
        }

        function searchSubmit() {
            if (vm.form.$invalid) {
                return;
            }
            $rootScope.loading = true;
            $rootScope.error = false;
            $state.go('root.search-results', {name: vm.name});
        }

        function searchBack() {
			$rootScope.myError = false;
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('main');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsCtrl', ItemsCtrl);

    ItemsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'items'];

    function ItemsCtrl($scope, $rootScope, $state, $timeout, items) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            itemsEditForm: itemsEditForm,
            itemsAdd: itemsAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            itemsBack: itemsBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Items';
            vm.items = items;
            vm.itemsFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function currentPage() {
            if (Object.prototype.toString.call(vm.items) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredItems = vm.items.slice(begin, end);
                $scope.totalItems = vm.items.length;
            }
        }

        function itemsEditForm(item) {
            $state.go('items-edit', {item: item});
        }

        function itemsAdd() {
            $state.go('items-add');
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function itemsBack() {
            $state.go('main');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
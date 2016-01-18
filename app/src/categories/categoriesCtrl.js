﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoriesCtrl', CategoriesCtrl);

    CategoriesCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'categories'];

    function CategoriesCtrl($scope, $rootScope, $state, $timeout, categories) {
        $scope.$watch('numPerPage', currentPage);
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            categoriesEditForm: categoriesEditForm,
            categoriesAdd: categoriesAdd,
            goToBack: goToBack,
            goToHead: goToHead,
            categoriesBack: categoriesBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            vm.title = 'Categories';
            vm.sort = 'name';
            vm.categories = categories;
            vm.categoriesFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;

            $rootScope.myError = false;
            $rootScope.loading = false;
        }

        function currentPage() {
            if (Object.prototype.toString.call(vm.categories) == '[object Array]') {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage);
                var end = parseInt(begin) + parseInt($scope.numPerPage);
                $scope.filteredClients = vm.categories.slice(begin, end);
                $scope.totalItems = vm.categories.length;
            }
        }

        function categoriesEditForm(item) {
            $state.go('categories-edit', {item: item});
        }

        function categoriesAdd() {
            $state.go('categories-add');
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }

        function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function categoriesBack() {
            $state.go('main');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
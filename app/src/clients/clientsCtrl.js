﻿(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsCtrl', ClientsCtrl);

    ClientsCtrl.$inject = ['$scope', '$rootScope', '$state', '$timeout', 'ClientsService', 'ClientsLocalStorage', 'clients'];

    function ClientsCtrl($scope, $rootScope, $state, $timeout, ClientsService, ClientsLocalStorage, clients) {
        $scope.$watch('numPerPage', currentPage);		
        $scope.$watch('currentPage', currentPage);
        var vm = this;

        angular.extend(vm, {
            init: init,
            currentPage: currentPage,
            numPages: numPages,
            clientsSort: clientsSort,
            clientsEditForm: clientsEditForm,
            clientsAdd: clientsAdd,
            goToBack: goToBack,
			goToHead: goToHead,
            clientsBack: clientsBack,
			_errorHandler: errorHandler
        });

        $timeout(function () {
            $scope.$broadcast('_scrollHere');
        });
		
		init();

        function init() {
            vm.title = 'Contacts';
            vm.sort = 'name';
			vm.clients = clients;
			vm.clientsFilter = [];

            $scope.currentPage = 1;
            $scope.numPerPage = 10;
            $scope.maxSize = 5;
			
			$rootScope.myError = false;
			$rootScope.loading = false;
		}
				 	
        function currentPage() {
            if (Object.prototype.toString.call(vm.clients) == '[object Array]') {
				var begin = (($scope.currentPage - 1) * $scope.numPerPage);
				var end = parseInt(begin) + parseInt($scope.numPerPage);
				$scope.filteredClients = vm.clients.slice(begin, end);
				$scope.totalItems = vm.clients.length;
			}
        }
		
        function numPages() {
            return Math.ceil(vm.clients.length / $scope.numPerPage);
        }

        function clientsSort(val) {
            vm.sort = val;
            vm.rev = !vm.rev;
        }

        function clientsEditForm(item) {
            $state.go('clients-edit', {item: item});
        }

        function clientsAdd() {
			console.log(vm.clients);
			localStorage.setItem('ui-collection.clients', JSON.stringify(vm.clients));
            $state.go('clients-add');
        }

        function goToBack() {
            $scope.$broadcast('scrollHere');
        }        
		
		function goToHead() {
            $scope.$broadcast('scrollThere');
        }

        function clientsBack() {
            $state.go('main');
        }
		
		function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
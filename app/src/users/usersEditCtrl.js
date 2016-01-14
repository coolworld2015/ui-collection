(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('UsersEditCtrl', UsersEditCtrl);

    UsersEditCtrl.$inject = ['$state', '$rootScope', '$filter', 
		'UsersService', 'UsersLocalStorage', 'SignsService',
		'$stateParams'];

    function UsersEditCtrl($state, $rootScope, $filter, 
		UsersService, UsersLocalStorage, SignsService,
		$stateParams) {
        var vm = this;

        angular.extend(vm, {
            init: init,
            usersSubmit: usersSubmit,
            usersDialog: usersDialog,
            usersEditBack: usersEditBack,
			_errorHandler: errorHandler
        });

        angular.extend(vm, $stateParams.item);

        init();

        function init() {
            vm.total = $filter('number')(vm.sum, 2);
        }

        function usersSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;
			
			var signName = SignsService.getSignName(vm.birthDate) || "logo";
            var item = {
                id: vm.id,
                name: vm.name,
                birthDate: vm.birthDate,
				signName: signName,
                description: vm.description
            };
				
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
				UsersService.editItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('users');
					})
					.catch(errorHandler);
			} else {
				UsersLocalStorage.editItem(item);
				$state.go('users');
			}
        }

        function usersDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('users-dialog', {item: obj});
        }

        function usersEditBack() {
            $state.go('users');
        }
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
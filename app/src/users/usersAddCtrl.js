(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersAddCtrl', UsersAddCtrl);

    UsersAddCtrl.$inject = ['$state', '$rootScope', 
		'SignsService',
		'UsersService', 'UsersLocalStorage'];

    function UsersAddCtrl($state, $rootScope, 
		SignsService,
		UsersService, UsersLocalStorage) {
        var vm = this;

        angular.extend(vm, {
            usersAddSubmit: usersAddSubmit,
            usersAddBack: usersAddBack,
			_errorHandler: errorHandler
        });

        function usersAddSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
			var signName = SignsService.getSignName(vm.birthDate) || "logo";
            var item = {
                id: id,
                name: vm.name,
                birthDate: vm.birthDate,
                signName: signName,
                description: vm.description
            };
			
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
				UsersService.addItem(item)
					.then(function () {
						$rootScope.myError = false;
						$state.go('users');
					})
					.catch(errorHandler);
			} else {
				UsersLocalStorage.addItem(item);
				$state.go('users');
			}
        }

        function usersAddBack() {
            $state.go('users');
        }
		
        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();

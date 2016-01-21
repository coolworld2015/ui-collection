(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsEditCtrl', ClientsEditCtrl);

    ClientsEditCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'ClientsService', 'ClientsLocalStorage', '$stateParams'];

    function ClientsEditCtrl($scope, $state, $rootScope, $timeout, ClientsService, ClientsLocalStorage, $stateParams) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;

        angular.extend(vm, {
			init: init,
            convertPicToJSON: convertPicToJSON,
            openPic: openPic,
            clientsSubmit: clientsSubmit,
            clientsDialog: clientsDialog,
            clientsEditBack: clientsEditBack,
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
		
        function convertPicToJSON() {
            var fileInput = document.getElementById("picFileInput");
            var files = fileInput.files;
            var file = files[0];
            var reader = new FileReader();
            reader.onload = function () {
                $scope.$apply(function () {
                    vm.pic = reader.result;
                });
            };
            console.log(file);
            reader.readAsDataURL(file);
        }

        function openPic() {
			$rootScope.loading = true;
            window.open(vm.pic);
		    $timeout(function () {
				$rootScope.loading = false;
			}, 3000);
        }

        function clientsSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.loading = true;
            $rootScope.myError = false;

            var item = {
                id: vm.id,
                name: vm.name,
                pic: vm.pic,
                description: vm.description
            };
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ClientsService.editItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('clients');
                    })
                    .catch(errorHandler);
            } else {
                ClientsLocalStorage.editItem(item);
				$rootScope.loading = true;
				$timeout(function () {
					$state.go('clients');
				}, 100);	
            }
        }

        function clientsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
			$rootScope.loading = true;
			$timeout(function () {
				$state.go('clients-dialog', {item: obj});
			}, 100);				
        }

        function clientsEditBack() {
			$rootScope.loading = true;
			$timeout(function () {
				$state.go('clients');
			}, 100);			
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
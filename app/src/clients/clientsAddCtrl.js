(function () {
    'use strict';

    angular
        .module('app')
        .controller('ClientsAddCtrl', ClientsAddCtrl);

    ClientsAddCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'ClientsService', 'ClientsLocalStorage'];

    function ClientsAddCtrl($scope, $state, $rootScope, $timeout, ClientsService, ClientsLocalStorage) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;

        angular.extend(vm, {
            init: init,
            convertPicToJSON: convertPicToJSON,
            clientsAddSubmit: clientsAddSubmit,
            clientsAddBack: clientsAddBack,
            _errorHandler: errorHandler
        });

        $timeout(function () {
            window.scrollTo(0, 0);
        });

        init();

        function init() {
            $rootScope.loading = false;
            vm.pic = $rootScope.picBlank;
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

        function clientsAddSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.myError = false;
            $rootScope.loading = true;

            var id = (Math.random() * 1000000).toFixed();
            var item = {
                id: id,
                name: vm.name,
                pic: vm.pic,
                description: vm.description
            };

            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                ClientsService.addItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('clients');
                    })
                    .catch(errorHandler);
            } else {
                ClientsLocalStorage.addItem(item);
				$rootScope.loading = true;
				$timeout(function () {
					$state.go('clients');
				}, 100);
            }
        }

        function clientsAddBack() {
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
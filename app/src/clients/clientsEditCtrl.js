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
			addPic: addPic,
            convertPicToJSON: convertPicToJSON,
            openPic: openPic,
            clientsSubmit: clientsSubmit,
			_editItem: editItem,
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
            if ($stateParams.item.name == undefined) {
                $state.go('clients');
            }

			if ($stateParams.item.pic == 'blank') {
				vm.pic = $rootScope.noImage;
			}			
            $rootScope.myError = false;
            $rootScope.loading = false;
			
			vm.blank = $rootScope.noImage;
			var picBlank = 'data:image/gif;base64,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';
        
			vm.testArray = [picBlank];
        }
		        
		function addPic(p) {
			vm.testArray.push('blank');
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
            reader.readAsDataURL(file);
        }

        function openPic() {
			$rootScope.loading = true;

		    $timeout(function () {
				window.open(vm.pic);
			}, 100);
			
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
						editItem(item);
                        $rootScope.myError = false;
                        $state.go('clients');
                    })
                    .catch(errorHandler);
            } else {
				try {
					ClientsLocalStorage.editItem(item);
					$rootScope.loading = true;
					$timeout(function () {
						$state.go('clients');
					}, 100);
				} catch(e) {
					errorHandler();
					alert(e);
				}	
            }
        }
		
        function editItem(item) {
            var clients = ClientsService.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == item.id) {
                    clients.splice(i, 1, item);
                    break;
                }
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
			$rootScope.myError = false;
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
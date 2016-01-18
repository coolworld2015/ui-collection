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
            window.open(vm.pic);
            return false;
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
                $state.go('clients');
            }
        }

        function clientsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('clients-dialog', {item: obj});
        }

        function clientsEditBack() {
            $rootScope.loading = true;
            $state.go('clients');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
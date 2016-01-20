(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsEditCtrl', ItemsEditCtrl);

    ItemsEditCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'ItemsService', 'ItemsLocalStorage', '$stateParams'];

    function ItemsEditCtrl($scope, $state, $rootScope, $timeout, ItemsService, ItemsLocalStorage, $stateParams) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;

        angular.extend(vm, {
            convertPicToJSON: convertPicToJSON,
            openPic: openPic,
            itemsSubmit: itemsSubmit,
            itemsDialog: itemsDialog,
            itemsEditBack: itemsEditBack,
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

        function itemsSubmit() {
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
                ItemsService.editItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('items');
                    })
                    .catch(errorHandler);
            } else {
                ItemsLocalStorage.editItem(item);
                $state.go('items');
            }
        }

        function itemsDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('items-dialog', {item: obj});
        }

        function itemsEditBack() {
            $rootScope.loading = true;
            $state.go('items');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
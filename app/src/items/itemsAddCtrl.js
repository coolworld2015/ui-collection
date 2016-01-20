(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsAddCtrl', ItemsAddCtrl);

    ItemsAddCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'ItemsService', 'ItemsLocalStorage'];

    function ItemsAddCtrl($scope, $state, $rootScope, $timeout, ItemsService, ItemsLocalStorage) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;

        angular.extend(vm, {
            init: init,
            convertPicToJSON: convertPicToJSON,
            itemsAddSubmit: itemsAddSubmit,
            itemsAddBack: itemsAddBack,
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

        function itemsAddSubmit() {
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
                ItemsService.addItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('items');
                    })
                    .catch(errorHandler);
            } else {
                ItemsLocalStorage.addItem(item);
                $state.go('items');
            }
        }

        function itemsAddBack() {
            $state.go('items');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
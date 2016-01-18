(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoriesAddCtrl', CategoriesAddCtrl);

    CategoriesAddCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'CategoriesService', 'CategoriesLocalStorage'];

    function CategoriesAddCtrl($scope, $state, $rootScope, $timeout, CategoriesService, CategoriesLocalStorage) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;

        angular.extend(vm, {
            init: init,
            convertPicToJSON: convertPicToJSON,
            categoriesAddSubmit: categoriesAddSubmit,
            categoriesAddBack: categoriesAddBack,
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

        function categoriesAddSubmit() {
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
                CategoriesService.addItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('categories');
                    })
                    .catch(errorHandler);
            } else {
                CategoriesLocalStorage.addItem(item);
                $state.go('categories');
            }
        }

        function categoriesAddBack() {
            $state.go('categories');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
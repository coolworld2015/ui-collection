(function () {
    'use strict';

    angular
        .module('app')
        .controller('CategoriesEditCtrl', CategoriesEditCtrl);

    CategoriesEditCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'CategoriesService', 'CategoriesLocalStorage', '$stateParams'];

    function CategoriesEditCtrl($scope, $state, $rootScope, $timeout, CategoriesService, CategoriesLocalStorage, $stateParams) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;

        angular.extend(vm, {
            convertPicToJSON: convertPicToJSON,
            openPic: openPic,
            categoriesSubmit: categoriesSubmit,
            categoriesDialog: categoriesDialog,
            categoriesEditBack: categoriesEditBack,
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

        function categoriesSubmit() {
            if (vm.form.$invalid) {
                return;
            }

            $rootScope.loading = true;
            $rootScope.myError = false;

            var item = {
                id: vm.id,
                name: vm.name,
                groups: vm.groups,
                description: vm.description
            };
            if ($rootScope.mode == 'ON-LINE (Heroku)') {
                CategoriesService.editItem(item)
                    .then(function () {
                        $rootScope.myError = false;
                        $state.go('categories');
                    })
                    .catch(errorHandler);
            } else {
                CategoriesLocalStorage.editItem(item);
                $state.go('categories');
            }
        }

        function categoriesDialog() {
            var obj = {
                id: vm.id,
                name: vm.name
            };
            $state.go('categories-dialog', {item: obj});
        }

        function categoriesEditBack() {
            $rootScope.loading = true;
            $state.go('categories');
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
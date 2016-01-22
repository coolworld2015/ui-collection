(function () {
    'use strict';

    angular
        .module('app')
        .controller('ItemsAddCtrl', ItemsAddCtrl);

    ItemsAddCtrl.$inject = ['$scope', '$state', '$rootScope', '$timeout', 'ItemsService', 'ItemsLocalStorage',
        'CategoriesLocalStorage', 'GroupsLocalStorage'];

    function ItemsAddCtrl($scope, $state, $rootScope, $timeout, ItemsService, ItemsLocalStorage,
                          CategoriesLocalStorage, GroupsLocalStorage) {
        $scope.convertPicToJSON = convertPicToJSON;
        var vm = this;
        var optionalCategory = {name: 'Select category'};
        var optionalGroup = {name: 'Select group'};

        angular.extend(vm, {
            init: init,
            updateChangeCategory: updateChangeCategory,
            updateChangeGroup: updateChangeGroup,
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
            var category = CategoriesLocalStorage.getCategories();
            vm.categoryOptions = [].concat(category);
            vm.categoryOptions.unshift(optionalCategory);
            vm.categorySelectedItem = vm.categoryOptions[0];

            var group = GroupsLocalStorage.getGroups();
            vm.groupOptions = [].concat(group);
            vm.groupOptions.unshift(optionalGroup);
            vm.groupSelectedItem = vm.groupOptions[0];

            $rootScope.loading = false;
            vm.pic = $rootScope.picBlank;
        }

        function updateChangeCategory(item) {
            vm.error = false;
            vm.categoryName = item.name;
        }

        function updateChangeGroup(item) {
            vm.error = false;
            vm.groupName = item.name;
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

        function itemsAddSubmit() {
            if (vm.categorySelectedItem.name == 'Select category') {
                vm.error = true;
                return;
            }

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
                category: vm.categoryName,
                group: vm.groupName,
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
                $rootScope.loading = true;
                $timeout(function () {
                    $state.go('items');
                }, 100);
            }
        }

        function itemsAddBack() {
            $rootScope.loading = true;
            $timeout(function () {
                $state.go('items');
            }, 100);
        }

        function errorHandler() {
            $rootScope.loading = false;
            $rootScope.myError = true;
        }
    }
})();
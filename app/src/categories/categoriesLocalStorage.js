(function () {
    'use strict';

    angular
        .module('app')
        .factory('CategoriesLocalStorage', CategoriesLocalStorage);

    CategoriesLocalStorage.$inject = ['$rootScope'];

    function CategoriesLocalStorage($rootScope) {
        var webUrl = $rootScope.myConfig.webUrl;

        return {
            clients: [],
            numPerPage: 10,

            getCategories: getCategories,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            setCategories: setCategories,

            uploadCategories: uploadCategories,
            _sort: sort
        };

        function getCategories() {
            if (CategoriesLocalStorage.clients === undefined) {
                var clients = localStorage.getItem('ui-collection.clients');
                clients = JSON.parse(clients);
                CategoriesLocalStorage.clients = clients;
            }

            if (CategoriesLocalStorage.clients === null) {
                CategoriesLocalStorage.clients = [];
            }

            return CategoriesLocalStorage.clients.sort(sort);
        }

        function addItem(item) {
            CategoriesLocalStorage.clients.push(item);
            setCategories();
        }

        function editItem(item) {
            var clients = CategoriesLocalStorage.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == item.id) {
                    clients.splice(i, 1, item);
                    setCategories();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var clients = CategoriesLocalStorage.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == id) {
                    clients.splice(i, 1);
                    setCategories();
                    break;
                }
            }
        }

        function setCategories() {
            localStorage.setItem('ui-collection.clients', JSON.stringify(CategoriesLocalStorage.clients));
        }

        function uploadCategories(clients) {
            localStorage.setItem('ui-collection.clients', JSON.stringify(clients));
            CategoriesLocalStorage.clients = undefined;
        }

        function sort(a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) {
                return -1
            }
            if (nameA > nameB) {
                return 1
            }
            return 0;
        }
    }
})();

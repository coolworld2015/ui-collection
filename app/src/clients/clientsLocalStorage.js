(function () {
    'use strict';

    angular
        .module('app')
        .factory('ClientsLocalStorage', ClientsLocalStorage);

    function ClientsLocalStorage() {
        return {
            clients: [],
            numPerPage: 10,

            getClients: getClients,
            addItem: addItem,
            editItem: editItem,
            deleteItem: deleteItem,
            setClients: setClients,

            uploadClients: uploadClients,
            findByName: findByName,
            _sort: sort
        };

        function getClients() {
            if (ClientsLocalStorage.clients === undefined) {
                var clients = localStorage.getItem('ui-collection.clients');
                clients = JSON.parse(clients);
                ClientsLocalStorage.clients = clients;
            }

            if (ClientsLocalStorage.clients === null) {
                ClientsLocalStorage.clients = [];
            }

            return ClientsLocalStorage.clients.sort(sort);
        }

        function addItem(item) {
            ClientsLocalStorage.clients.push(item);
            setClients();
        }

        function editItem(item) {
            var clients = ClientsLocalStorage.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == item.id) {
                    clients.splice(i, 1, item);
                    setClients();
                    break;
                }
            }
        }

        function deleteItem(id) {
            var clients = ClientsLocalStorage.clients;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].id == id) {
                    clients.splice(i, 1);
                    setClients();
                    break;
                }
            }
        }

        function setClients() {
            localStorage.setItem('ui-collection.clients', JSON.stringify(ClientsLocalStorage.clients));
        }

        function uploadClients(clients) {
            localStorage.setItem('ui-collection.clients', JSON.stringify(clients));
            ClientsLocalStorage.clients = undefined;
        }

        function findByName(name) {
            getClients();
            var clients = ClientsLocalStorage.clients;
            var results = [];
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].name.toUpperCase().indexOf(name.toUpperCase()) > -1) {
                    results.push(clients[i]);
                }
            }
            return results;
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

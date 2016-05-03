(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ui.bootstrap']);

    angular
        .module('app')
        .run(runHandler);

    runHandler.$inject = ['$rootScope', '$state'];

    function runHandler($rootScope, $state) {
        $rootScope.$on('$stateChangeStart1', function (event, toState) { //TODO Change $stateChangeStart
            var requireLogin = toState.data.requireLogin;
            if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
                event.preventDefault();
                $state.go('login');
            }
        });
    }

    angular
        .module('app')
        .run(init);

    init.$inject = ['$rootScope'];

    function init($rootScope) {
        var mode;
        if ($rootScope.mode === undefined) {
            mode = localStorage.getItem('ui-collection.mode');
            mode = JSON.parse(mode);
            $rootScope.mode = mode;
        }

        if ($rootScope.mode === null) {
            mode = 'OFF-LINE (LocalStorage)';
            localStorage.setItem('ui-collection.mode', JSON.stringify(mode));
            $rootScope.mode = mode;
        }

        $rootScope.picBlank = 'data:image/gif;base64,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';
        $rootScope.noImage = 'data:image/png;base64,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';

        $rootScope.numPerPageItems = 10;

        $rootScope.myConfig = {
            webUrl: 'http://ui-collection.herokuapp.com/' //TODO Heroku MongoDB
            //webUrl: 'http://localhost:3000/' //TODO Local MongoDB
            //webUrl: 'http://localhost:3000/file/' //TODO Local JSON DB
        };

        //$rootScope.mode = 'OFF-LINE (LocalStorage)'; //TODO !!! ONLY for Google Market
        $rootScope.mode = 'ON-LINE (Heroku)'; //TODO !!! ONLY for Web Site - change index.html (idly-user-logout) and $stateChangeStart
    }
})();
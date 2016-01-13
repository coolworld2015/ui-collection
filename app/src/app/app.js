(function () {
    'use strict';
    
    angular
        .module('app', ['ui.router']);
	
    angular
        .module('app')
        .run(runHandler);
		
	runHandler.$inject = ['$rootScope','$state'];
	
    function runHandler($rootScope, $state) {
        $rootScope.$on('$stateChangeStart1', function (event, toState, toParams) {
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
		$rootScope.mode = '';
        $rootScope.myConfig = {
            webUrl: 'http://m-api.californiapsychics.com/horoscope?format=json'
        };
    }

})();
angular.module('app', ['ngRoute', 'Rootscope'])

.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
    $routeProvider.

    when('/', {templateUrl: 'views/home.html', controller: HomeCtrl}).

    otherwise({redirectTo: '/'});
}])

.run(function($rootScope){
});
var app = angular.module('simpleMap', [
  'ngRoute',
  'MapControllers'
]);


app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/maps', {
        templateUrl: 'templates/view_map-list.html',
        controller: 'ListMapController'
      }).
      when('/maps/:mapsId', {
        templateUrl: 'templates/view_map-detail.html',
        controller: 'DetailMapController'
      }).
      otherwise({
        redirectTo: '/maps'
      });
  }]);

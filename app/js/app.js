var app =  angular.module('gnaviApp', [
  'gnaviApp.services',
  'ngRoute',
  'ngTable',
  'nvd3ChartDirectives'
]);

app.config(['$routeProvider', function($routeProvider) {

	// $locationProvider.html5Mode(true);
	// $locationProvider.hashPrefix = '#';

	$routeProvider.
		// when("/", {templateUrl: "views/prefs.html", controller: "prefsController"}).
		when("/prefs", {templateUrl: "views/prefs.html", controller: "prefsController"}).
		when("/areas", {templateUrl: "views/areas.html", controller: "areasController"}).
		when("/cats", {templateUrl: "views/cats.html", controller: "catsController"}).
		when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "driverController"}).
		otherwise({redirectTo: '/prefs'});
}]);


// var app =  angular.module('gnaviApp', [
//   'gnaviApp.services',
//   'gnaviApp.controllers',
//   'ngRoute',
//   'ngTable',
//   'nvd3ChartDirectives'
// ]);

// app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

// 	$locationProvider.html5Mode(true);
// 	$locationProvider.hashPrefix = '#';

// 	$routeProvider.
// 		// when("/", {templateUrl: "views/prefs.html", controller: "prefsController"}).
// 		when("/app/prefs", {templateUrl: "views/prefs.html", controller: "prefsController"}).
// 		when("/app/areas", {templateUrl: "views/areas.html", controller: "areasController"}).
// 		when("/drivers/:id", {templateUrl: "partials/driver.html", controller: "driverController"}).
// 		otherwise({redirectTo: '/app/prefs'});
// }]);
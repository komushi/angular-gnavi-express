var gnaviAPIservice = function($injectHttp, $injectQ) {

    $q = $injectQ;
    $http = $injectHttp;

    // var AreaList = function() {};

    var gnaviAPI = {};

    gnaviAPI.getPrefs = function() {
      return $http({
        method: 'GET', 
        url: 'http://localhost:9000/getGnaviPrefs'
      });
    };

    gnaviAPI.getAreas = function() {
      var deferred = $q.defer();
      var uri = 'http://localhost:9000/getGnaviAreas';
      $http({
        method: 'GET', 
        url: uri
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function () {
        deferred.reject('Failed to get Collection List');
      });
      return deferred.promise;
    };

    gnaviAPI.getCats = function() {
      var deferred = $q.defer();
      var uri = 'http://localhost:9000/getGnaviCats';
      $http({
        method: 'GET', 
        url: uri
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function () {
        deferred.reject('Failed to get Collection List');
      });
      return deferred.promise;
    };

    gnaviAPI.getRestByArea = function(areaCode) {
      var deferred = $q.defer();
      var uri = 'http://localhost:9000/getGnaviRestByArea/?area=' + areaCode;
      $http({
        method: 'GET', 
        url: uri
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function () {
        deferred.reject('Failed to get Collection List');
      });
      return deferred.promise;
    };

    gnaviAPI.getRestByCat = function(catCode) {
      var deferred = $q.defer();
      var uri = 'http://localhost:9000/getGnaviRestByCat/?category_l=' + catCode;
      $http({
        method: 'GET', 
        url: uri
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function () {
        deferred.reject('Failed to get Collection List');
      });
      return deferred.promise;
    };

    gnaviAPI.getRestByAreaCat = function(areaCode, catCode) {
      var deferred = $q.defer();
      var uri = 'http://localhost:9000/getGnaviRestByAreaCat/?category_l=' + catCode + '&area=' + areaCode;

      // var uri = 'http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9&category_l=' + catCode + '&area=' + areaCode + '&hit_per_page=1&format=json&callback=JSON_CALLBACK';
      
      $http({
        method: 'GET', 
        url: uri
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function () {
        deferred.reject('Failed to get Collection List');
      });
      return deferred.promise;
    };

    return gnaviAPI;
};


var gnaviModule = angular.module('gnaviApp.services', []);
gnaviModule.factory('gnaviAPIservice', ['$http', '$q', gnaviAPIservice]);


var gnaviAPIservice = function($injectHttp, $injectQ) {

    $q = $injectQ;
    $http = $injectHttp;

    // var AreaList = function() {};

    var gnaviAPI = {};

    gnaviAPI.getPrefs = function() {
      return $http({
        method: 'JSONP', 
        url: 'http://api.gnavi.co.jp/ver1/PrefSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &format=json&callback=JSON_CALLBACK'
      });
    };

    // gnaviAPI.getAreas = function() {
    //   return $http({
    //     method: 'JSONP',
    //     url: 'http://api.gnavi.co.jp/ver1/AreaSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &format=json&callback=JSON_CALLBACK'
    //   });
    // }

    gnaviAPI.getAreas = function() {
      var deferred = $q.defer();
      var uri = 'http://api.gnavi.co.jp/ver1/AreaSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &format=json&callback=JSON_CALLBACK';
      $http({
        method: 'JSONP', 
        url: uri
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function () {
        deferred.reject('Failed to get Collection List');
      });
      return deferred.promise;
    };

    // gnaviAPI.getCats = function() {
    //   return $http({
    //     method: 'JSONP',
    //     url: 'http://api.gnavi.co.jp/ver1/CategoryLargeSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &format=json&callback=JSON_CALLBACK'
    //   });
    // };

    gnaviAPI.getCats = function() {
      var deferred = $q.defer();
      var uri = 'http://api.gnavi.co.jp/ver1/CategoryLargeSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &format=json&callback=JSON_CALLBACK';
      $http({
        method: 'JSONP', 
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
      var uri = 'http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &area=' + areaCode + '&hit_per_page=1&format=json&callback=JSON_CALLBACK';
      $http({
        method: 'JSONP', 
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
      var uri = 'http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &category_l=' + catCode + '&hit_per_page=1&format=json&callback=JSON_CALLBACK';
      $http({
        method: 'JSONP', 
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
      var uri = 'http://api.gnavi.co.jp/ver1/RestSearchAPI/?keyid=3752190c2d640eb83d502e192085ccf9 &category_l=' + catCode + '&area=' + areaCode + '&hit_per_page=1&format=json&callback=JSON_CALLBACK';
      
      $http({
        method: 'JSONP', 
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


angular.module('gnaviApp').

  /* Prefs controller */
  controller('areasCatsController', function($scope, gnaviAPIservice, ngTableParams) {

    var model = {
      chartData:[],
      catList:[]
    };

    // var catList = [];



    var getRest = function(areaCode, catCode, callback) {
        return gnaviAPIservice.getRestByAreaCat(areaCode, catCode).then(
          function(data) {
            return callback(data);
          }
        );

    };


    var getRestCount = function(areaCode, catList, callback){
      var prom = [];
      var valueList = [];
     console.log(catList); 
      catList.forEach(function (obj, i) {
          prom.push(getRest(areaCode, obj.category_l_code, function(data){
console.log(data);
console.log(obj);
              var jsonObj = angular.fromJson(
                '[' + obj.category_l_name + 
                ',' + data.total_hit_count + ']');

              valueList.push(jsonObj);
          }));
      });

      $q.all(prom).then(function () {

          callback(valueList);
      });
    };

    var tableSlice = function(data, params){

      return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
    };

    var initData = function (data) {
      getRestCount(data, function (catCountList) {
        angular.extend(model.catCountList, catCountList);
        
        angular.extend($scope, {
          model: model
        });
      });
    };


    var pushChartData = function () {
      // console.log($scope.area);
      var areaObj = $scope.area;
      getRestCount(areaObj.area_code, model.catList, function (valueList) {

        var series = {
          key:{},
          values:[]
        }

        angular.extend(seriesList, {
          key: areaObj.area_name,
          values: valueList
        });

        model.chartData.push(series);

      });
    };


    var xAxisTickFormatFunction = function(){
        return function(d){
          // console.log("d");
          // console.log(d);
          return d3.time.format('%b')(new Date(d));
        }
    };

    var pushDummy = function(){

        // var jsonObj =
        //   {
        //       "key": "Series 5",
        //       "values": [
        //           [
        //               1025409600000,
        //               10
        //           ],
        //           [
        //               1028088000000,
        //               16.3382185140371
        //           ],
        //           [
        //               1030766400000,
        //               15.9507873460847
        //           ],
        //           [
        //               1033358400000,
        //               11.569146943813
        //           ],
        //       ]
        //   };
          
        //   $scope.exampleData.push(jsonObj);

    };


    // angular.extend($scope, {
      
    //   xAxisTickFormatFunction: xAxisTickFormatFunction,
    //   xFunction: xFunction,
    //   yFunction: yFunction,
    //   descriptionFunction: descriptionFunction,
    //   pushDummy: pushDummy

    // });

    var initialize = function () {
      gnaviAPIservice.getAreas().then(function(response) {
        
          var data = response.area;

          var tableParams = 
            new ngTableParams({
                page: 1,            // show first page
                count:10           // count per page
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {
                    $defer.resolve(tableSlice(data, params));
                }
            });

          // initData(data);

          angular.extend($scope, {
            tableParams: tableParams
          });
      });

      gnaviAPIservice.getCats().then(function(response) {
        
          var data = response.category_l;

          angular.extend(model.catList, data);

      });

      angular.extend($scope, {
        model: model,
        pushDummy: pushDummy,
        pushChartData: pushChartData,
        area:{
          area_code: "AREA110",
          area_name: "関東"
        }
      });

    };

    initialize();

      // console.log("model");
      // console.log(model);
  });
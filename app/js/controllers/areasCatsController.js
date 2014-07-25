angular.module('gnaviApp').

  /* Prefs controller */
  controller('areasCatsController', function($scope, gnaviAPIservice, ngTableParams) {

    var model = {
      chartData:[],
      catList:[]
    };

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

      catList.forEach(function (obj, i) {
          prom.push(getRest(areaCode, obj.category_l_code, function(data){
// console.log(data);
// console.log(obj);
              var jsonObj = angular.fromJson(
                '["' + obj.category_l_name + 
                '",' + data.total_hit_count + ']');

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


    var pushChartData = function (areaObj) {
      // console.log($scope.area);
      // console.log(model);

      getRestCount(areaObj.area_code, model.catList, function (valueList) {

        var series = {
          key:{},
          values:[]
        }

        angular.extend(series, {
          key: areaObj.area_name,
          values: valueList
        });

        model.chartData.push(series);

        console.log(model.chartData);

      });
    };

    var xAxisTickFormatFunction = function(){
        return function(d){
          return d;
        }
    };

    var changeSelection = function(data) {
        console.info(data);
        pushChartData(data);
    } 

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
        pushChartData: pushChartData,
        changeSelection: changeSelection,
        area:{
          area_code: "AREA110",
          area_name: "関東"
        }
      });

    };

    initialize();

  });
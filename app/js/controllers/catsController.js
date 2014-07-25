angular.module('gnaviApp').

  /* Prefs controller */
  controller('catsController', function($scope, gnaviAPIservice, ngTableParams) {

    var model = {
      catCountList:[]
    };

    var getRest = function(catCode, callback) {
        return gnaviAPIservice.getRestByCat(catCode).then(
          function(data) {

            
            return callback(data);
          }
        );

    };

    var getRestCount = function(catList, callback){
        var prom = [];
        var catCountList = [];

        catList.forEach(function (obj, i) {
            prom.push(getRest(obj.category_l_code, function(data){
                var jsonObj = angular.fromJson(
                    '{"category_l_name":"' + obj.category_l_name + 
                    '","category_l_code":"' + obj.category_l_code + 
                    '","count":' + data.total_hit_count + '}');

                catCountList.push(jsonObj);
            }));
        });

        $q.all(prom).then(function () {
            callback(catCountList);
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

    var xFunction = function(){
        return function(d) {
            return d.category_l_name;
        }
    };

    var yFunction = function(){
        return function(d) {
            return d.count;
        }
    };

    var descriptionFunction = function(){
        return function(d){
            return d.category_l_name;
        }
    };

    var xAxisTickFormatFunction = function(){
        return function(d){
          // console.log("d");
          // console.log(d);
          return d3.time.format('%b')(new Date(d));
        }
    };

    var pushDummy = function(){
      console.log("click12");
        var jsonObj =
          {
              "key": "Series 5",
              "values": [
                  [
                      1075525200000,
                      10
                  ],
                  [
                      1028088000000,
                      16.3382185140371
                  ],
                  [
                      1067576400000,
                      15.9507873460847
                  ],
                  [
                      1033358400000,
                      11.569146943813
                  ],
              ]
          };
          
          $scope.exampleData.push(jsonObj);

    };

$scope.exampleData =
[
    {
        "key": "Series 1",
        "values": [
            [
                1025409600000,
                0
            ],
            [
                1028088000000,
                -6.3382185140371
            ],
            [
                1030766400000,
                -5.9507873460847
            ],
            [
                1033358400000,
                -11.569146943813
            ],
            [
                1036040400000,
                -5.4767332317425
            ],
            [
                1038632400000,
                0.50794682203014
            ],
            [
                1041310800000,
                -5.5310285460542
            ],
            [
                1043989200000,
                -5.7838296963382
            ],
            [
                1046408400000,
                -7.3249341615649
            ],
            [
                1049086800000,
                -6.7078630712489
            ],
            [
                1051675200000,
                0.44227126150934
            ],
            [
                1054353600000,
                7.2481659343222
            ],
            [
                1056945600000,
                9.2512381306992
            ]
        ]
    },
    {
        "key": "Series 2",
        "values": [
            [
                1025409600000,
                0
            ],
            [
                1028088000000,
                0
            ],
            [
                1030766400000,
                0
            ],
            [
                1033358400000,
                0
            ],
            [
                1036040400000,
                0
            ],
            [
                1038632400000,
                0
            ],
            [
                1041310800000,
                0
            ],
            [
                1043989200000,
                0
            ],
            [
                1046408400000,
                0
            ],
            [
                1049086800000,
                0
            ],
            [
                1051675200000,
                0
            ],
            [
                1054353600000,
                0
            ],
            [
                1056945600000,
                0
            ],
            [
                1059624000000,
                0
            ],
            [
                1062302400000,
                0
            ],
            [
                1064894400000,
                0
            ],
            [
                1067576400000,
                0
            ],
            [
                1070168400000,
                0
            ],
            [
                1072846800000,
                0
            ],
            [
                1075525200000,
                -0.049184266875945
            ]
        ]
    },
    // {
    //     "key": "Series 3",
    //     "values": [
    //         [
    //             1025409600000,
    //             0
    //         ],
    //         [
    //             1028088000000,
    //             -6.3382185140371
    //         ],
    //         [
    //             1030766400000,
    //             -5.9507873460847
    //         ],
    //         [
    //             1033358400000,
    //             -11.569146943813
    //         ],
    //         [
    //             1036040400000,
    //             -5.4767332317425
    //         ],
    //         [
    //             1038632400000,
    //             0.50794682203014
    //         ],
    //         [
    //             1041310800000,
    //             -5.5310285460542
    //         ],
    //         [
    //             1043989200000,
    //             -5.7838296963382
    //         ],
    //         [
    //             1046408400000,
    //             -7.3249341615649
    //         ],
    //         [
    //             1049086800000,
    //             -6.7078630712489
    //         ],
    //         [
    //             1051675200000,
    //             0.44227126150934
    //         ],
    //         [
    //             1054353600000,
    //             7.2481659343222
    //         ],
    //         [
    //             1056945600000,
    //             9.2512381306992
    //         ]
    //     ]
    // },
    // {
    //     "key": "Series 4",
    //     "values": [
    //         [
    //             1025409600000,
    //             -7.0674410638835
    //         ],
    //         [
    //             1028088000000,
    //             -14.663359292964
    //         ],
    //         [
    //             1030766400000,
    //             -14.10439306054
    //         ],
    //         [
    //             1033358400000,
    //             -23.114477037218
    //         ],
    //         [
    //             1036040400000,
    //             -16.774256687841
    //         ],
    //         [
    //             1038632400000,
    //             -11.902028464
    //         ],
    //         [
    //             1041310800000,
    //             -16.883038668422
    //         ],
    //         [
    //             1043989200000,
    //             -19.104223676831
    //         ],
    //         [
    //             1046408400000,
    //             -20.420523282736
    //         ],
    //         [
    //             1049086800000,
    //             -19.660555051587
    //         ],
    //         [
    //             1051675200000,
    //             -13.106911231646
    //         ],
    //         [
    //             1054353600000,
    //             -8.2448460302143
    //         ],
    //         [
    //             1056945600000,
    //             -7.0313058730976
    //         ]
    //     ]
    // }
];


    angular.extend($scope, {
      
      xAxisTickFormatFunction: xAxisTickFormatFunction,
      xFunction: xFunction,
      yFunction: yFunction,
      descriptionFunction: descriptionFunction,
      pushDummy: pushDummy

    });
      console.log("exampleData");
      console.log($scope.exampleData);




    gnaviAPIservice.getCats().then(function(response) {

        var data = response.category_l;

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

        initData(data);

        angular.extend($scope, {
          tableParams: tableParams
        });
    });    

  });
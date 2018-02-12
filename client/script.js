var app = angular.module("myapp", []);

app.controller("mainController", ['$scope','$http','$timeout', ($scope, $http, $timeout)=>{
  $scope.details="";
  $scope.show3city=false;
  $scope.TelAviv="";
  $scope.Jerusalem="";
  $scope.cityDetails="";
  $scope.$on('LOAD', ()=>{$scope.loading=true;});
  $scope.$on('UNLOAD', ()=>{$scope.loading=false;});
  //Get data for Tel-Aviv and Jerusalem and display :
  $scope.loadData= ()=>{
    $scope.$emit('LOAD');
    $http.get("http://localhost:8080/weatherByCity/tel_aviv")
    .then((response)=>{
      $scope.TelAviv = response.data;
     });
     $timeout( ()=>{
       $http.get("http://localhost:8080/weatherByCity/jerusalem")
       .then((response)=>{ $scope.Jerusalem = response.data;
         $scope.$emit('UNLOAD');
        });
     }, 1000);
  };
  $scope.loadData();
  $scope.search= ()=>{
    $scope.$emit('LOAD');
    $http.get("http://localhost:8080/weatherByCity/" + $scope.cityDetails.toLowerCase())
    .then((response)=>{
      $scope.details = response.data;
      if($scope.details.error){
        alert("City Not Found");
        $scope.show3city=false;
      }
      else{
        $scope.show3city=true;
      }
      $scope.cityDetails="";// Clean textbox
      $scope.$emit('UNLOAD');
     });
  };
}]);


app.directive('googleplace', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, model) {
        var options = {
              types: [],
              componentRestrictions: {}
          };
        scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            scope.$apply(function() {
              model.$setViewValue(element.val());
              scope.search();
            });
          });
        }
    };
});

function MyCtrl($scope) {
    $scope.gPlace;
}

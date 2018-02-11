var app = angular.module("myapp", []);

app.controller("mainController", ['$scope','$http','$timeout', ($scope, $http, $timeout)=>{
  $scope.details="";
  $scope.show3city=false;
  $scope.TelAviv="";
  $scope.Jerusalem="";
  $scope.cityDetails="";
  $scope.$on('LOAD', ()=>{$scope.loading=true;});
  $scope.$on('UNLOAD', ()=>{$scope.loading=false;});
  $scope.cities=['Haifa', "Jerusalem" ,"Azor", "Even Yehuda" , "Ashdod" ,"Beer Yaakov", "Beit Shean", "Givatayim",
  "Ganne Tiqwa", "Zihron Yaakov", "Kefar Sava", "Modiin", "Nahariyya", "Netivot", "Afula", "Caesarea","Qiryat Shemona",
  "Rishon Lezion","Sderot","Ashqelon","Eilat", "Bney Beraq" ,"Gedera","Dimona","Herzliya","Hadera","Hermon","Yavne",
  "Kefar Weradim","Karmiel","Mizpe Ramon","Nazareth","Netanya","Arad","Petah Tikva","Kiryat Ono","Qiryat Gat","Qiryat Motzkin",
  "Rosh Haayin","Rehovot","Ramat Gan","Ramat Hasharon","Tel Aviv","Or Yehuda","Ariel","Beersheva","Bet Shemesh","Bat Yam","Gan Yavne",
  "Hod Hasharon","Holon","Tiberias","Yokneam Ilit","Kefar Yona","Kefar Shemaryahu","Lod","Nesher","Savyon","Zefat","Tamra","Raanana"];
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
  //Autocomplete function:
  $scope.complete= (string)=>{
    $scope.hidethis= false;
    if($scope.cityDetails==""){
      $scope.hidethis= true;
    }
    var output=[];
    angular.forEach($scope.cities , (city)=>{
      if(city.toLowerCase().indexOf(string.toLowerCase()) == 0){
        output.push(city); // Match!
      }
    });
    $scope.filterCity= output;
  };
  //Fill textbox by click on li element
  $scope.fillTextBox = (string)=>{
    $scope.cityDetails= string;
    $scope.hidethis= true;
    $scope.search(); // Get data from server
  };
  //Get data from server
  $scope.search= ()=>{
    $scope.$emit('LOAD');
    $http.get("http://localhost:8080/weatherByCity/" + $scope.cityDetails.toLowerCase())
    .then((response)=>{
      $scope.details = response.data;
      if($scope.details.error){
        alert("City Not Found");
      }
      $scope.show3city=true;
      $scope.cityDetails="";// Clean textbox
      $scope.$emit('UNLOAD');
     });
  };
}]);

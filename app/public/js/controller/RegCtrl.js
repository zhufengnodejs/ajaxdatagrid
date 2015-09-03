angular.module('shopApp').controller('RegCtrl',function($scope,$http,$location){
    $scope.user = {};
    $scope.save = function(){
        $http({
            url:'/users/reg',
            method:'POST',
            data:$scope.user
        }).success(function(user){
            $location.path('/users/login');
        }).error(function(){
            $location.path('/users/reg');
        });
    }
});
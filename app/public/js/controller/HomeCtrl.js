angular.module('shopApp').controller('HomeCtrl',function($scope,UserFactory){
    $scope.title = "欢迎光临珠峰网上商城";
    $scope.users = UserFactory.query();
});
//$resource 封闭了http,适合restful
angular.module('shopApp').factory('UserFactory', function($resource){
    return $resource('Users/users.json')
});


angular.module('shopApp').directive('sayHello', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<h1>hello</h1>'
    };
});

angular.module('shopApp').filter('bigger', function() {
    return function(text) {
        return text+'bigger';
    };
});
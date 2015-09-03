angular.module('shopApp').controller('CartCtrl', function ($scope, $http, $location,$timeout) {
    $scope.carts = [];
    $http({
        url:'/carts/list',
        method:'GET'
    }).success(function(carts){
        $scope.carts = carts;
        $scope.calculate();
    }).error(function(data){
        $scope.carts = [];
    });

    $scope.calculate = function(){
        var sum = 0;
        $('input[name="chkItem"]:checked').each(function(){
            var self = $(this);
            var price = self.attr('data-price');
            var quantity = parseInt(self.parent().parent().find('input:eq(1)').val());
            console.log(price,quantity);
            sum +=price*quantity;
        });
        $("#total").html(sum);
    }
    $scope.settle = function(){
        var _ids = [];
        $('input[name="chkItem"]:checked').each(function(){
            _ids.push($(this).data('id'));
        });
        if(_ids.length){
            $http({
                url:'/carts/settle',
                method:'POST',
                data:{_ids:_ids}
            }).success(function(carts){
                $scope.carts = carts;
                $scope.calculate();
            }).error(function(data){
                $scope.carts = [];
            });
        }else{
            $('#noSettleDialog').modal(true);
        }
    }
});

angular.module('shopApp').directive('changeQuantity',function($http){
    return {
        link:function(scope,element,attrs){
            element.on('click',function(){
                var _id = attrs.id;
                var input = $(this).siblings('input');
                var newQuantity = parseInt(input.val())+parseInt(attrs['changeQuantity']);
                if(newQuantity>0){
                    $http({
                        url:'/carts/changeQuantity',
                        method:'POST',
                        data:{_id:_id,quantity:newQuantity}
                    }).success(function(result){
                        input.val(newQuantity);
                        scope.calculate();
                    }).error(function(data){
                    });
                }
            });
        }
    }
});


angular.module('shopApp').directive('deleteCarts',function($http,$location,$timeout){
    return {
        link:function(scope,element,attrs){
            element.on('click',function(){
                $http({
                    url: '/carts/del/'+attrs.id,
                    method: 'GET'
                }).success(function (result) {
                    scope.$parent.carts = scope.carts.filter(function(cart){
                        return cart._id != attrs.id;
                    });
                    $timeout(function(){
                        scope.calculate();
                    },100)

                }).error(function (data) {
                });
            });
        }
    }
});


angular.module('shopApp').directive('batchDeleteCarts', function ($http) {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                var carts = $("input[type='checkbox']:checked");
                var _ids = [];
                carts.each(function () {
                    _ids.push($(this).attr('data-id'));
                });
                console.log(_ids);
                $http({
                    url: '/carts/batchDelete',
                    method: 'POST',
                    data: {_ids: _ids}
                }).success(function (cart) {
                    scope.carts = scope.carts.filter(function (cart) {
                        return _ids.indexOf(cart._id) == -1;
                    });
                }).error(function () {

                });
            });
        }
    }
})

angular.module('shopApp').directive('selectAll',function(){
    return {
        link:function(scope,element,attrs){
            element.on('click',function(){
                var self = $(this);
                $("input[type='checkbox']").each(function(){
                    $(this).prop('checked',self.prop('checked'));
                });
                scope.calculate();
            });

        }
    }
});

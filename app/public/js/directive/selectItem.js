angular.module('shopApp').directive('selectItem',function(){
    return {
        link:function(scope,element,attrs){
            element.on('click',function(){
                var isCheck = $('input[name="chkItem"]:not(:checked)').length?false:true;
                $('#selectAll').prop("checked",isCheck);
                scope.calculate();
            });

        }
    }
});
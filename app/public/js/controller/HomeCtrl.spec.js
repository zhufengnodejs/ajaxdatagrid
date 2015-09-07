(function() {
    'use strict';
    describe('controllers', function(){
        beforeEach(module('shopApp'));
        it('正确的欢迎语', inject(function($controller) {
            var vm = $controller('HomeCtrl');
            expect(vm.title = '欢迎光临珠峰网上商城').toBeTruthy();
        }));
    });
})();

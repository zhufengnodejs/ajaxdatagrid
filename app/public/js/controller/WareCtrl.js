angular.module('shopApp').controller('WareCtrl', function ($rootScope, $scope, $http, $location,fileReader,dataService) {
    $scope.keyword = '';//当前过滤关键字
    $scope.filterWares = [];//当页的数据
    $scope.pageNumber = 1;//当前的页数
    $scope.pageSize = 4;
    $scope.pages = [];// 1 2 3
    $scope.wares = [];//存放所有的商品

    $http({
        url: '/wares/list',
        method: 'GET'
    }).success(function (wares) {
        $scope.wares = wares;
        $scope.filter();
    }).error(function () {

    });

    $scope.filter = function () {
        var filterWares = $scope.wares.filter(function (ware) {
            return ware.name.indexOf($scope.keyword) != -1;
        });
        $scope.pages = [];
        $scope.totalPage = Math.ceil(filterWares.length / $scope.pageSize);
        for (var i = 1; i <= $scope.totalPage; i++) {
            $scope.pages.push(i);
        }
        filterWares = filterWares.filter(function (ware, index) {
            return index>=($scope.pageNumber-1) * $scope.pageSize && index < filterWares.length && index < $scope.pageNumber * $scope.pageSize;
        });
        $scope.filterWares = filterWares;
    }

    $scope.go = function (page) {
        if (page > 0 && page <= $scope.totalPage) {
            $scope.pageNumber = page;
            $scope.filter();
        }
    }

    //读取scope上的file值
    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function (result) {
                $scope.ware.imgSrc = result;
            });
    };

    $scope.save = function () {
        var promise = postMultipart('/wares/add', $scope.ware);
        promise.success(function (ware) {
            if (!$scope.ware._id)
                $scope.wares.push(ware);
            else {
                $scope.wares.forEach(function (ware) {
                    if (ware._id = $scope.ware._id) {
                        ware = $scope.ware;
                    }
                });
            }
            console.log($scope.wares);
            $scope.filter();
        }).error(function () {

        });
    }

    function postMultipart(url, data) {
        var fd = new FormData();
        angular.forEach(data, function(val, key) {
            fd.append(key, val);
        });
        var options = {
            method: 'POST',
            url: url,
            data: fd,
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity
        };
        return $http(options);
    }

    $scope.delete = function () {
        $http({
            url: '/wares/delete',
            method: 'POST',
            data: $scope.ware
        }).success(function (ware) {
           $scope.wares  = $scope.wares.filter(function (ware) {
                    return ware._id != $scope.ware._id;
            });
            $scope.filter();
        }).error(function () {

        });
    }

    //添加到购物车
    $scope.addCart = function(wareId){
        dataService.post('/wares/addCart/'+wareId,function(){
            $('#addCartDoneDialog').modal(true);
        });
    }
});


angular.module('shopApp').directive('addWares', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                $('#imgSrc').val('');
                $('#imgPreview').prop('src','');

                scope.$apply(function () {
                    scope.ware = {};
                });
                $('#addDialog').modal(true);
            });
        }
    }
})

angular.module('shopApp').directive('viewWares', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                scope.$apply(function () {
                    scope.$parent.ware = scope.filterWares[attrs.index];
                });
                $('#viewDialog').modal(true);
            });
        }
    }
})


angular.module('shopApp').directive('editWares', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                scope.$apply(function () {
                    scope.$parent.ware = scope.filterWares[attrs.index];
                });
                $('#addDialog').modal(true);
            });
        }
    }
})

angular.module('shopApp').directive('deleteWares', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                scope.$apply(function () {
                    scope.$parent.ware = scope.filterWares[attrs.index];
                });
                $('#deleteDialog').modal(true);
            });
        }
    }
})


angular.module('shopApp').directive('selectAllWares', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                var self = $(this);
                $("input[type='checkbox']").each(function () {
                    $(this).prop('checked', self.prop('checked'));
                });
            });
        }
    }
})

angular.module('shopApp').directive('selectWareItem', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                var isChecked = $("input[type='checkbox']:not(:checked)").length ? false : true;
                $('#selectAllWares').prop('checked', isChecked);
            });
        }
    }
})

angular.module('shopApp').directive('batchDeleteWares', function ($http) {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                var wares = $("input[type='checkbox']:checked");
                var _ids = [];
                wares.each(function (index, ware) {
                    _ids.push($(ware).attr('data-id'));
                });
                $http({
                    url: '/wares/batchDelete',
                    method: 'POST',
                    data: {_ids: _ids}
                }).success(function (ware) {
                    scope.wares = scope.wares.filter(function (ware) {
                        return _ids.indexOf(ware._id) == -1;
                    });
                    scope.filter();
                }).error(function () {

                });
            });
        }
    }
})
//上传文件指令
angular.module('shopApp').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',//只限定Attribute使用
        link: function (scope, element, attrs, ngModel) {
            element.bind('change', function (event) {
                scope.file = element[0].files[0];
                scope.getFile();
            });
        }
    };
}]);

//创建fileReader的服务
angular.module('shopApp').factory('fileReader', ["$q", function ($q) {
        //读取成功后触发
        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        //失败后触发
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        //获取文件读取器
        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader;
        };
        //读取为dataurl
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
            var reader = getReader(deferred, scope);
            //readAsDataURL：这是例子程序中用到的方法，该方法将文件读取为一段以 data: 开头的字符串，这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html 等格式的文件。
            reader.readAsDataURL(file);
            return deferred.promise;
        };
        return {
            readAsDataUrl: readAsDataURL
        };
    }])
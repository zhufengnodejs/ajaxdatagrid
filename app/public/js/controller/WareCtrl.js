angular.module('shopApp').controller('WareCtrl', function ($rootScope, $scope, $http, $location) {
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
            return index < filterWares.length && index < $scope.pageNumber * $scope.pageSize;
        });
        $scope.filterWares = filterWares;
    }

    $scope.go = function (page) {
        if (page > 0 && page <= $scope.totalPage) {
            $scope.pageNumber = page;
            $scope.filter();
        }
    }

    $scope.save = function () {
        console.log($scope.ware);
        $http({
            url: '/wares/add',
            method: 'POST',
            data: $scope.ware
        }).success(function (ware) {
            if (!$scope.ware._id)
                $scope.wares.push(ware);
            else {
                $scope.wares.forEach(function (ware) {
                    if (ware._id = $scope.ware._id) {
                        ware = $scope.ware;
                    }
                });
            }
        }).error(function () {

        });
    }

    $scope.delete = function () {
        $http({
            url: '/delete',
            method: 'POST',
            data: $scope.ware
        }).success(function (ware) {
            $scope.wares = $scope.wares.filter(function (ware) {
                return ware._id != $scope.ware._id;
            });
        }).error(function () {

        });
    }
});


angular.module('shopApp').directive('addWares', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
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

angular.module('shopApp').directive('batchDeleteWares', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function () {
                var wares = $("input[type='checkbox']:checked");
                var _ids = [];
                wares.each(function (index, ware) {
                    _ids.push($(ware).attr('data-id'));
                });
                $http({
                    url: '/batchDelete',
                    method: 'POST',
                    data: {_ids: _ids}
                }).success(function (ware) {
                    scope.wares = scope.wares.filter(function (ware) {
                        return _ids.indexOf(ware._id) == -1;
                    });
                }).error(function () {

                });
            });
        }
    }
})

angular.module('shopApp').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function (event) {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getFile();
            });
        }
    };
}]);

angular.module('shopApp').controller('UploaderController', function ($scope, fileReader) {
    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
            .then(function (result) {
                $scope.imageSrc = result;
            });
    };
})

angular.module('shopApp').factory('fileReader', ["$q", "$log", function ($q, $log) {
        var onLoad = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
        var getReader = function (deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader;
        };
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);
            return deferred.promise;
        };
        return {
            readAsDataUrl: readAsDataURL
        };
    }])
'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles', function () {
  //less的配置
  var lessOptions = {
    options: [
      path.join(conf.paths.src, 'public','styles')
    ]
  };
  //要插入的文件
  var injectFiles = gulp.src([
    path.join(conf.paths.src, '/public/**/*.less'),
    path.join('!' + conf.paths.src, '/public/styles/index.less')
  ], { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.src + '/public/styles/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',//开始标识
    endtag: '// endinjector',//结束标识
    addRootSlash: false//是否要加根/
  };


  return gulp.src([
    path.join(conf.paths.src, '/public/styles/index.less')
  ])
    .pipe($.inject(injectFiles, injectOptions))//把自己写的less文件添加到index中
    .pipe(wiredep(_.extend({}, conf.wiredep)))//把组件里的less添加到 index.less中
    .pipe($.sourcemaps.init())//把源码写到源文件中
    .pipe($.less(lessOptions)).on('error', conf.errorHandler('Less'))//开始编译less
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))//自动添加厂商前缀
    .pipe($.sourcemaps.write())//写入源代码
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')))//把CSS文件写入临时文件中
    .pipe(browserSync.reload({ stream: true }));//重启
});

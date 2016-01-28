'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');//在不同的浏览器之间同步

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src([path.join(conf.paths.src, '/app/**/*.js'),"!"+path.join(conf.paths.src, '/app/**/*spec*.js')])//取得所有的JS
    .pipe($.jshint())//进行代码风格检查
    .pipe($.jshint.reporter('jshint-stylish'))//指定风格报告器
    .pipe(browserSync.reload({ stream: true }))//重新加载
    .pipe($.size())//显示前后体系大小对比
});

'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');
/**
 * 现在是
 */
gulp.task('inject', ['scripts', 'styles'], function () {
  //插入css
  var injectStyles = gulp.src([
    path.join(conf.paths.tmp, '/serve/app/**/*.css'),//bootstrap也混在了index.css里面
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')//除了bootstrap外其它第三方的CSS文件
  ], { read: false });

  //插入js
  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/public/js/**/*.js'),
    path.join('!' + conf.paths.src, '/public/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/public/**/*.mock.js')
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));//进行排序以保证依赖关系正确

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  /**
   *开始向index.html中注入css和js
   */
  return gulp.src(path.join(conf.paths.src, '/public/*.html'))
    .pipe($.inject(injectStyles, injectOptions))//注入自己写的样式
    .pipe($.inject(injectScripts, injectOptions))//注入自己写的JS
    .pipe(wiredep(_.extend({}, conf.wiredep)))//自动注入第三方的库和包 由于样式已经合并到
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));//写入临时目录
});

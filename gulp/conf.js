/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 *  这个文件包含了在gulp配置文件中定义的任务使用的变量
 *  根据设计，我们只放置公用的配置
 *
 */

var gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 *  项目处理过程中需要注意的主要路径
 */
exports.paths = {
  src: 'app',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e'
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 *  Wiredep是在你的项目中自动注入bower依赖的类库
 *  主要用来注入script标记到index.html中
 *  也可以在karma中注入主css预处理依赖和JS文件
 */
exports.wiredep = {
  //exclude: [/bootstrap.js$/, /bootstrap\.css/],
  directory: 'app/public/lib'//自动注入第三方的包
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 *
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',
}
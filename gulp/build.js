'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
    return gulp.src([
        path.join(conf.paths.src, '/public/pages/**/*.html')
    ]).pipe($.minifyHtml({
        empty: true,
        spare: true,
        quotes: true
    })).pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'shopApp',
            root: 'app'
    })).pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

//真正处理html
gulp.task('html', ['inject', 'partials'], function () {
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
    var partialsInjectOptions = {
        starttag: '<!-- inject:partials -->',
        ignorePath: path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var htmlFilter = $.filter('*.html');//过滤html
    var jsFilter = $.filter('**/*.js');//过滤js
    var cssFilter = $.filter('**/*.css');//过滤css
    var assets;

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))//取得临时目录里所有的.html文件
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))//插入index文件
        .pipe(assets = $.useref.assets()) // 解析html中build:{type}块，将里面引用到的文件合并传过来
        .pipe($.rev())//静态资源为文件名通过增加HASH内容更新版本号
        .pipe(jsFilter)
        .pipe($.ngAnnotate())//为JS文件添加声明
        .pipe($.uglify({ preserveComments: $.uglifySaveLicense })).on('error', conf.errorHandler('Uglify'))//代码进行压缩
        .pipe(jsFilter.restore())//返回过滤器
        .pipe(cssFilter)//css过滤器
        .pipe($.replace('../../bower_components/bootstrap/fonts/', '../fonts/'))//替换路径
        .pipe($.csso())//最小化css
        .pipe(cssFilter.restore())
        .pipe(assets.restore())//恢复资源
        .pipe($.useref())//恢复引用
        .pipe($.revReplace())//替换引用到原来HTML中
        .pipe(htmlFilter)//压缩HTMl
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))//保存html文件
        .pipe($.size({ title: path.join(conf.paths.dist, '/'), showFiles: true }));
});


// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
    return gulp.src(['**/*.{eot,svg,ttf,woff,woff2}'])
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function () {
    var fileFilter = $.filter(function (file) {
        return file.stat.isFile();
    });

    return gulp.src([
        path.join(conf.paths.src, '/**/*'),
        path.join('!' + conf.paths.src, '/public/**/*.{html,css,js,less}')
    ]).pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function (done) {
    $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')], done);
});

gulp.task('build', ['html', 'fonts', 'other']);

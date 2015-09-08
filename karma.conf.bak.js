'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');//JAVASCRIPT的工具类
var wiredep = require('wiredep');//自动注入

function listFiles() {
    var wiredepOptions = _.extend({}, conf.wiredep, {
        dependencies: true,//生产依赖
        devDependencies: true//开发依赖
    });
    var js = wiredep(wiredepOptions).js;
    return js.concat([
        path.join(conf.paths.src, '/public/js/app.js'),
        path.join(conf.paths.src, '/public/js/controller/HomeCtrl.js'),
        path.join(conf.paths.src, '/public/js/controller/HomeCtrl.spec.js')
    ]);
    /*return [
            path.join(conf.paths.src, '/public/lib/jquery/dist/jquery.js'),
            path.join(conf.paths.src, '/public/lib/bootstrap/dist/js/bootstrap.js'),
            path.join(conf.paths.src, '/public/lib/angular/angular.js'),
            path.join(conf.paths.src, '/public/lib/angular-mocks/angular-mocks.js'),
            path.join(conf.paths.src, '/public/lib/angular-route/angular-route.js'),
            path.join(conf.paths.src, '/public/js/app.js'),
            path.join(conf.paths.src, '/public/js/controller/HomeCtrl.js'),
            path.join(conf.paths.src, '/public/js/controller/HomeCtrl.spec.js')
        ];*/
}

module.exports = function(config) {
    var configuration = {
        files: listFiles(),
        singleRun: true,
        autoWatch: true,
        frameworks: ['jasmine'],
        angularFilesort: {
            whitelist: [path.join(conf.paths.src, '/**/!(*.html|*.spec|*.mock).js')]
        },
        ngHtml2JsPreprocessor: {
            stripPrefix: '/app',
            moduleName: 'shopApp'
        },
        browsers : ['PhantomJS'],
        plugins : [
            'karma-phantomjs-launcher',
            'karma-angular-filesort',
            'karma-jasmine',
            'karma-ng-html2js-preprocessor'
        ],
        preprocessors: {
            'app/**/*.html': ['ng-html2js']
        }
    };

    // This block is needed to execute Chrome on Travis
    // If you ever plan to use Chrome and Travis, you can keep it
    // If not, you can safely remove it
    // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
    if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
        configuration.customLaunchers = {
            'chrome-travis-ci': {
                base: 'Chrome',
                flags: ['--no-sandbox']
            }
        };
        configuration.browsers = ['chrome-travis-ci'];
    }

    config.set(configuration);
};

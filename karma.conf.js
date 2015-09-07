module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        files: [
            'app/public/lib/angular/angular.js',
            'app/public/lib/angular-route/angular-route.js',
            'app/public/js/**/*.js',
            'e2e/**/*.spec.js'
        ]
    });
};
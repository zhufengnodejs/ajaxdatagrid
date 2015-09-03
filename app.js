var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
mongoose.connect('mongodb://123.57.143.189/zhufengshop');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var users = require('./routes/users');
var wares = require('./routes/wares');
var carts = require('./routes/carts');

var app = express();
app.set('views', path.join(__dirname, 'app','public'));
app.set('view engine', 'html');
app.engine('html', require('ejs').__express);
app.use(favicon(path.join(__dirname, 'app','public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app','public')));
app.use(session({
    secret:'zhufengshop',
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:60*60*1000
    },
    store:new MongoStore({
        url:'mongodb://123.57.143.189/zhufengshop'
    })
}));
app.use('/', routes);
app.use('/users', users);
app.use('/wares', wares);
app.use('/carts', carts);
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        throw err;
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    throw err;
});

process.on('unCaughtException',function(){
    console.log(arguments);
});

app.listen(8080);

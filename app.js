var restify = require('restify');
var fs = require('fs');
var server = restify.createServer();
server.get(/\/lib.*/, restify.serveStatic({
    directory: './public'
}));

server.get('/', function(req,res){
    fs.createReadStream('index.html').pipe(res);
});


server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});
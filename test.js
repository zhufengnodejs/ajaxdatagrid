var s = 'data:image/jpeg;base64';
var mime = require('mime');
var key = s.slice(s.indexOf(':')+1,s.indexOf(';'));
var ext = mime.extension(key);
console.log(ext);

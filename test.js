var obj = {
    key1:'value1',
    key2:'value2',
    key3:'value3'
}
var keys = Object.keys(obj);
keys.forEach(function(key){
    console.log(obj[key]);
});
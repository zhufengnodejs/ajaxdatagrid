var mongoose = require('mongoose');
module.exports =  mongoose.model('User', new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    avatar:String,
    role:{type:Number,default:0}
}));
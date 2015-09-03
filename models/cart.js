var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
module.exports =  mongoose.model('Cart', new mongoose.Schema({
    user:{type:ObjectId,ref:'User'},
    ware:{type:ObjectId,ref:'Ware'},
    quantity:{type:Number,default:1}
}));
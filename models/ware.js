var mongoose = require('mongoose');
module.exports =  mongoose.model('Ware', new mongoose.Schema({
    name: String,
    price: Number,
    imgSrc: String
}));
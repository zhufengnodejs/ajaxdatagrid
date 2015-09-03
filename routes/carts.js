var express = require('express');
var router = express.Router();
var Cart = require('../models').Cart;
var async = require('async');
var auth = require('../middleware/auth');
router.get('/list',auth.mustLogin,function(req,res){
    Cart.find({}).populate("ware").exec(function(err,carts){
        console.log(carts);
        if(err){
            res.status(500).json({msg:err});
        }else{
            res.json(carts);
        }
    });
});
router.post('/changeQuantity',auth.mustLogin,function(req,res){
    Cart.update({_id:req.body._id},{$set:{quantity:req.body.quantity}},function(err,result){
        if(err){
            res.status(500).json({msg:err});
        }else{
            res.json(result);
        }
    });
});


//删除购物车
router.get("/del/:_id",auth.mustLogin, function(req, res) {
    Cart.remove({"_id":req.params._id},function(error,result){
        if (error) {
            res.json(500, {msg: error});
        } else {
            res.json(result);
        }
    });
});

router.post("/settle",auth.mustLogin, function(req, res,next) {
    var userId = req.session.userId;
    var _ids = req.body._ids;
    var length = _ids.length;
    var count=0;
    var deleteTasks = {};
    _ids.forEach(function(_id){
        deleteTasks[_id] = function(callback){
            Cart.remove({_id:_id},function(error,result){
                callback(error,result);
            });
        }
    });
    deleteTasks['query']= Object.keys(deleteTasks).concat(function(callback,result){
        Cart.find({user:userId}).populate("ware").exec(function (err, wares) {
            callback(err,wares);
        });
    });
    async.auto(deleteTasks,function(error,result){
        if (error) {
            res.json(500, {msg: error});
        } else {
            res.json(result.query);
        }
    });
});


router.post("/batchDelete",auth.mustLogin, function(req, res,next) {
    var userId = req.session.userId;
    var _ids = req.body._ids;
    var length = _ids.length;
    var count=0;
    var deleteTasks = {};
    _ids.forEach(function(_id){
        deleteTasks[_id] = function(callback){
            Cart.remove({_id:_id},function(error,result){
                callback(error,result);
            });
        }
    });
    deleteTasks['query']= Object.keys(deleteTasks).concat(function(callback,result){
        Cart.find({user:userId}).populate("ware").exec(function (err, wares) {
            callback(err,wares);
        });
    });
    async.auto(deleteTasks,function(error,result){
        if (error) {
            res.json(500, {msg: error});
        } else {
            res.json(result.query);
        }
    });
});
module.exports = router;

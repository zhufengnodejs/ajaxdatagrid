var express = require('express');
var Ware = require('../models').Ware;
var multer = require('multer');
var mime = require('mime');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var parser = multer().single('imgSrc');

router.post('/add',parser,function (req, res) {
    var _id = req.body._id;
    var imgInfos = req.body.imgSrc.split(',');
    var ext = mime.extension(imgInfos[0].slice(imgInfos[0].indexOf(':')+1,imgInfos[0].indexOf(';')));
    var imgSrc = Date.now()+'.'+ext;
    fs.writeFile('./app/public/upload/'+imgSrc,imgInfos[1],'base64',function(){
        if (_id) {
            Ware.update({_id: _id}, {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    imgSrc: '/upload/'+imgSrc
                }
            }, function (err, good) {
                if (err) {
                    res.status(500).json({msg: err});
                } else {
                    res.json(good);
                }
            });
        } else {
            new Ware({name: req.body.name, price: req.body.price, imgSrc: '/upload/'+imgSrc}).save(function (err, good) {
                if (err) {
                    res.status(500).json({msg: err});
                } else {
                    res.json(good);
                }
            });
        }
    });

});


router.post('/delete', function (req, res) {
    Ware.remove({_id: req.body._id}, function (err, result) {
        if (err) {
            res.json(500, {msg: err});
        } else {
            res.json(result);
        }
    });
});

router.post('/batchDelete', function (req, res) {
    var _ids = req.body._ids;
    var tasks = [];
    _ids.forEach(function (_id) {
        tasks.push(function (callback) {
            models.Goods.remove({_id: _id}, callback);
        });
    });
    async.parallel(tasks, function (err, result) {
        if (err) {
            res.json(500, {msg: err});
        } else {
            res.json(result);
        }
    });
});

router.get('/list', function (req, res) {
    Ware.find({}, function (err, goods) {
        if (err) {
            res.json(500, {msg: err});
        } else {
            console.log(goods);
            res.json(goods);
        }
    });
});


module.exports = router;
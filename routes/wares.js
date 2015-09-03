var express = require('express');
var Ware = require('../models').Ware;
var Cart = require('../models').Cart;
var multer = require('multer');
var mime = require('mime');
var path = require('path');
var async = require('async');
var router = express.Router();
var uuid = require('uuid');
var fs = require('fs');
var auth = require('../middleware/auth');
var parser = multer().single('imgSrc');

router.post('/add', auth.mustLogin, auth.mustAdmin, parser, function (req, res) {
    var _id = req.body._id;
    if (req.body.imgSrc) {
        var imgInfos = req.body.imgSrc.split(',');
        var ext = mime.extension(imgInfos[0].slice(imgInfos[0].indexOf(':') + 1, imgInfos[0].indexOf(';')));
        var imgSrc = uuid.v4() + '.' + ext;
    }
    fs.writeFile('./app/public/upload/' + imgSrc, imgInfos[1], 'base64', function () {
        if (_id) {
            Ware.update({_id: _id}, {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    imgSrc: '/upload/' + imgSrc
                }
            }, function (err, good) {
                if (err) {
                    res.status(500).json({msg: err});
                } else {
                    res.json(ware);
                }
            });
        } else {
            new Ware({
                name: req.body.name,
                price: req.body.price,
                imgSrc: '/upload/' + imgSrc
            }).save(function (err, ware) {
                if (err) {
                    res.status(500).json({msg: err});
                } else {
                    res.json(ware);
                }
            });
        }
    });

});


router.post('/delete', auth.mustLogin, auth.mustAdmin, function (req, res) {
    Ware.remove({_id: req.body._id}, function (err, result) {
        if (err) {
            res.json(500, {msg: err});
        } else {
            res.json(result);
        }
    });
});

router.post('/batchDelete', auth.mustLogin, auth.mustAdmin, function (req, res) {
    var _ids = req.body._ids;
    var tasks = [];
    _ids.forEach(function (_id) {
        tasks.push(function (callback) {
            Ware.remove({_id: _id}, callback);
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

router.get('/list', auth.mustLogin, function (req, res) {
    Ware.find({}, function (err, wares) {
        if (err) {
            res.json(500, {msg: err});
        } else {
            res.json(wares);
        }
    });
});


router.post('/addCart/:wareId', auth.mustLogin, function (req, res) {
    var userId = req.session.userId;
    var wareId = req.params.wareId;
    Cart.findOne({user: userId, ware: wareId}, function (err, cart) {
        if (cart) {
            Cart.update({_id: cart._id}, {$inc: {quantity: 1}}, function (err, result) {
                if (err) {
                    res.status(500).json({msg: err});
                } else {
                    res.json(result);
                }
            });
        } else {
            new Cart({
                user: userId,
                ware: wareId
            }).save(function (err, cart) {
                    if (err) {
                        res.status(500).json({msg: err});
                    } else {
                        res.json(cart);
                    }
                });
        }
    });

});

module.exports = router;
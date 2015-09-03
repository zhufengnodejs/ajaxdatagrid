var express = require('express');
var Ware = require('../models').Ware;

var router = express.Router();

router.post('/add', function (req, res) {
    var _id = req.body._id;
    if (_id) {
        Ware.update({_id: _id}, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                imgSrc: req.body.imgSrc
            }
        }, function (err, good) {
            if (err) {
                res.json(500, {msg: err});
            } else {
                res.json(good);
            }
        });
    } else {
        new Ware({name: req.body.name, price: req.body.price, imgSrc: req.body.imgSrc}).save(function (err, good) {
            if (err) {
                res.json(500, {msg: err});
            } else {
                res.json(good);
            }
        });
    }
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
        console.error(goods);
        if (err) {
            res.json(500, {msg: err});
        } else {
            console.log(goods);
            res.json(goods);
        }
    });
});


module.exports = router;
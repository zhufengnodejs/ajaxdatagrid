var express = require('express');
var router = express.Router();
var User = require('../models').User;
var crypto = require('crypto');

function encrypt(content){
  return crypto.createHash('md5').update(content).digest('hex');
}

router.post('/validate',function(req,res){
  var userId = req.session.userId;
  console.error('userId',userId);
  if(userId){
    User.findOne({_id:userId},function(err,user){
      if(err){
        res.json(401,{msg:err});
      }else{
        res.json(user);
      }
    });
  }else{
    res.status(401).json({msg:'不存在'});
  }
});

router.post('/logout',function(req,res){
  req.session.userId = null;
  res.json({msg:'退出成功'});
});

router.post('/reg',function(req,res){
  var user = req.body;
  var md5Email = encrypt(user.email);
  var avatar = "https://secure.gravatar.com/avatar/"+md5Email+"?s=48";
  new User({username:user.username,password:encrypt(user.password),email:user.email,avatar:avatar}).save(function(err,resultUser){
    if(err){
      res.status(500).json({msg:err});
    }else{
      res.json(resultUser);
    }

  });
});

router.post('/login',function(req,res){
  User.findOne({username:req.body.username,password:encrypt(req.body.password)},{username:1},function(err,user){
    if(err){
      res.status(500).json({msg:err});
    }else{
      if(user){
        req.session.userId = user._id;
        res.json(user);
      }else{
        res.status(401).json({msg:'此用户不合法'});
      }

    }
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var pool = require('../model/pool');
var User = require('../model/user');
var jwt = require("jsonwebtoken");
var crypto = require('crypto');
module.exports = router;

//注册
router.post("/", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var userName = req.body.userName;
  console.log('register.js: 进来啦'+ email+'  '+ password+ '  '+userName);
  var salt = (new Date()).toUTCString();
  var md5 = crypto.createHash('md5');
  password = md5.update( password + salt ).digest('hex');

  User.get(email, function(err,msg, newUser){

    if(msg!="no user"){//用户已存在，请求登陆，而不是注册。
      console.log('register.js: 注册失败，用户已存在。');
      data = {};
      data.msg = "注册失败";
      return res.json(JSON.stringify(data));

    }

    newUser.save(function(){
      console.log("register.js: 用户注册成功.");
      data = {};
      data.msg = "注册成功";
      return res.json(JSON.stringify(data));
    });
  });

});

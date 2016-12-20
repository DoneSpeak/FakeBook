var express = require('express');
var router = express.Router();
var pool = require('../model/pool');
var jwt = require("jsonwebtoken");
var crypto = require('crypto');
var User = require('../model/user');

router.get('/',function(req, res){
  return res.render('login');

});

router.post('/', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  User.get(email, function(err, msg, user){
    if(msg=="no user"){
       return res.status(401).json({err: "用户不存在，请先注册"});
    }

    //对用户输入的密码进行md5+salt加密,并与数据库中的密文进行对比。
    var md5 = crypto.createHash('md5');
    var encodePassword = md5.update( password + user.register_date).digest('hex');
    if(encodePassword != user.password){
      var msg =  "密码错误，请重新输入";
      console.log('login.js : 用户错误输入密码');
       return res.status(401).json({err: msg})
    }else{ //密码校验成功。
      console.log('账号密码匹配');
      //使用"scret"对token进行签名。token只是一个字符串，但是secret只有我们知道，所以别人之只能截获，不能篡改。
      //token的内容，当登录时可以在req.user中获得。
      var authToken = jwt.sign({
        email: email,
        user_id : user.user_id,
        name: user.name,
        exp: Math.floor(Date.now() / 1000) + (600 * 60),
        avatar : user.avatar
      }, "secret");
      return res.status(200).json({token: authToken});
    }
  });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var User = require('../model/user');
module.exports = router;

router.get('/', function(req, res, next){
  var keyword = req.query.keyword;
  console.log("搜索好友请求");
  res.render('user',{
    users : users
  });
}

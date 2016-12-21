var express = require('express');
var router = express.Router();
var User = require('../model/user');
module.exports = router;

router.get('/', function(req, res, next){
  console.log("搜索好友请求");
  var keyword = req.query.keyword;
  var me = req.user.name;
  if(keyword == undefined){
    console.log('关键词为空，这应该是前端处理的错误。');
    res.redirect('/');
  }
  var user = new User({
    user_id : req.user.user_id
  })
  User.searchUser(req.user.user_id, keyword, function(users){
    user.checkFriendRequest(function(friend_requests){
      console.log(users, req.user, friend_requests);
      res.render('user',{
        users : users,
        user: req.user,
        friend_requests: friend_requests
      });
    })

  });

});

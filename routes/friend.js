var express = require('express');
var router = express.Router();
var User = require('../model/user');
module.exports = router;

router.get('/', function(req, res, next){
  console.log('获取到的数据有');
  var anotherUser = req.query.user_id;
  var user = new User({
    user_id : req.user.user_id
  });
  user.makeFriendWith(anotherUser, function(){
    console.log('成功发送请求');
    res.json({
      msg: "成功发送请求"
    })
  })

});

router.delete('/refuse', function(req, res, next){
  console.log('拒绝好友请求路由')
  var sender = req.body.user_id;
  var user = new User({
    user_id : req.user.user_id
  });
  user.rejectFriend(sender, function(){
    console.log('拒绝成功')
    res.json({
      msg:"拒绝成功"
    })
  })
});

router.get('/accept', function(req, res, next){
  console.log('接受好友请求路由');
  var sender = req.query.user_id;
  var user = new User({
    user_id : req.user.user_id
  });
  user.acceptFriend(sender, function(){
    console.log('接受成功')
    res.json({
      msg:"接受成功"
    })
  })

})

router.get('/confirm', function(req, res, next){
  console.log('点击确认');
  var receiver = req.query.user_id;
  var user = new User({
    user_id : req.user.user_id
  });
  user.confirmFriend(receiver, function(){
    console.log('完成好友请求(接受或拒绝)')
    res.json({
      msg:"完成好友请求"
    })
  })
})

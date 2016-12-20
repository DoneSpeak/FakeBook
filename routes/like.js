var express = require('express');
var router = express.Router();
var Like = require('../model/like');


//添加赞
router.post('/', function(err, req, res){
  var liker = req.user.user_id;
  var type = req.body.type;
  var post_id = req.body.post_id;
    Like.addLike(liker, type, post_id, function(){
      console.log('in like.js: 点赞成功');
      res.status(200).end();
    })
});

//删除赞
router.delete('/', function(err, req, res){
  var liker = req.user.user_id;
  var type = req.body.type;
  var post_id = req.body.post_id;
  Like.cancelLike(liker, type, post_id, function(){
    console.log('in like.js: 取消点赞成功');
    res.status(200).end();
  })
});
module.exports = router;

var express = require('express');
var router = express.Router();
var Comment = require('../model/comment');



//获取评论
router.get('/', function(req, res, next){
  console.log(req.query);
  console.log(req.body);
  var post_id = req.query.post_id;
  var earliestCommentId = req.query.last_comment_id;  //客户端命名有误，应当是最旧的那条评论id
  if(earliestCommentId == -1){ //第一次查看评论时
    Comment.getLatestComment(post_id, function(comments){
      console.log('comment.js: 共检索出评论条数'+ comments.length);
      res.json({
        comments : comments,
        num_of_comment: comments.length
      });
    });
  }else{// 请求翻页
    console.log('这里没问题');
    Comment.getFiveCommentEarlier(post_id, earliestCommentId, function(comments){
      console.log('comment.js: 共检索出评论条数'+ comments.length);
      res.json({
        comments: comments,
        num_of_comment: comments.length
      })
    });
  }

});
//新评论
router.post('/', function(req, res, next){
  var now = Date.now();
  console.log(req.body);
  var comment = new Comment({
    sender : req.user.user_id,
    belong_to_post : req.body.post_id,
    content : req.body.content,
    date: now,
    last_modified_date: now
  });
  comment.newComment(function(insertId){
    console.log('in comment.js : 成功新增评论。');
    res.json({
      msg:"发表评论成功",
      comment_id : insertId,
      last_modified_date: now
    });
  });

});

//修改我的评论
router.put('/', function(req, res, next){
  var now = Date.now();
  var comment = new Comment({
    content: req.body.content,
    last_modified_date : now,
    comment_id : req.body.comment_id
  });
  comment.updateComment(function(){
    console.log('in comment.js: 成功更新评论。');
    res.json({
      msg: "更新评论成功",
      last_modified_time: now
    });
  });
});

//删除评论
router.delete('/', function(req, res, next){
  Comment.delete(req.body.comment_id, function(){
    console.log('in comment.js: 成功是删除评论。');
    res.json({
      msg: "删除成功"
    });
  });
});
module.exports = router;

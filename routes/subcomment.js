var express = require('express');
var router = express.Router();
var Subcomment = require('../model/subcomment');

//新子评论
router.post('/', function( req, res){
  var comment_id = req.body.comment_id;
  var content = req.body.content;
  console.log(comment_id +" "+ content);
  var now = Date.now();
  var subcomment = new Subcomment({
    sender : req.user.user_id,
    belong_to_comment : comment_id,
    content : content,
    date : now,
    last_modified_date : now,
  });
  subcomment.save(function(subcomment_id){
    console.log('in subcomment.js : 成功新增评论，id为: '+subcomment_id);
    res.json({
      subcomment_id: subcomment_id,
      date: now
    })
  })
});

//修改我的子评论
router.put('/', function( req, res){
  var subcomment_id = req.body.subcomment_id;
  var content = req.body.content;
  var now = Date.now();

  var subcomment = new Subcomment({
    subcomment_id : subcomment_id,
    content : content,
    last_modified_date : now
  })

  subcomment.updateSubcomment(function(){
    res.json({
      last_modified_date : now,
      msg : "成功更新子评论"
    })
  })


});

//获取子评论
router.get('/', function( req, res){
  //
  console.log(req.body);
  console.log(req.query);
  var lastId = req.body.last_subcomment_id;
  var comment_id = req.body.comment_id;
  if(lastId == -1){
    lastId = "9999999999";
  }

  Subcomment.getSubcomment(lastId, comment_id, function(subcomment){
    console.log('成功获取子评论');
    res.status(200).json({
      subcomment: subcomment
    });
  });
})

//删除子评论
router.delete('/', function( req, res){
  console.log(req.body);
  var subcomment_id = req.body.subcomment_id;
  console.log(req.query);

  Subcomment.deleteOne(subcomment_id, function(){
    res.json({
      message: "删除成功"
    });
  })

});
module.exports = router;

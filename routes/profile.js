var express = require('express');
var router = express.Router();
var multer  = require('multer')
var User = require('../model/user');

var storage = multer.diskStorage({

     destination:'public/pictures',
     filename:function(req,file,cb){
     var splits = file.originalname.split('.');
     var suffix = splits[splits.length - 1]
    cb(null,file.fieldname + '-' + Date.now() + '.' + suffix)
     }
});
var upload = multer({ storage: storage });

//获取所有个人信息
router.get('/:userId', function(err, req, res){
  var userId = req.user.user_id;



});


//更新个人信息
router.put('/', function(err, req, res){

  var user = new User({
    name : req.body.name,
    sex : req.body.sex,
    school: req.body.school,
    major: req.body.major,
    intro : req.body.intro,
    user_id : req.user.user_id
  })
  user.updateInfo(function(){
    res.json({
      msg:"成功更新帖子"
    })
  })
});
module.exports = router;

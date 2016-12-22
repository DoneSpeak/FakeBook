var express = require('express');
var router = express.Router();
var multer  = require('multer')
var User = require('../model/user');
var Post = require('../model/post');

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
router.get('/:userId', function(req, res, next){
  var userId = req.params.userId;
  var type = "first";
  //获取个人信息
  User.getUserById(userId, function(me){
    console.log('--检索用户个人信息成功' ,  me);
    //获取朋友信息
    var last_user_id = 0; //首次进入，故直接赋值为0.翻页时会有其他值。
    me.getFriend(type, last_user_id, function(friends){
      console.log('--检索好友成功', friends);
      //获取帖子信息
      var lastPost = "9999999999"; //同上
      Post.getAllMyPost(userId, lastPost, function(posts){
        console.log('--检索帖子成功，共检索出',posts.length,'条帖子');
        console.log(posts);
        res.json({
          me: me,
          friends: friends,
          posts: posts
        });
        // res.render('user',{
        //
        // })
      })
    })
  })

});
router.get('/friends/more'), function(req, res, next){
  var type = req.query.type;
  var friend_id = req.query.last_user_id;
  var me = new User({
    user_id : req.user.user_id
  });
  me.getFriend(type, friend_id, function(friends){
    console.log('--检索好友成功', friends);
  });

}
router.get('/posts/more', function(req, res, next){

  var userId = req.user.user_id;
  var lastPost = req.query.last_post_id;
  Post.myPaging(userId, lastPost , function(posts){
    console.log('in profile.js: 翻页，展示了帖子条数' + posts.length);
    res.status(200).json({
      posts: posts
    })
  });
});



//更新个人信息
router.put('/', function(req, res, next){

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

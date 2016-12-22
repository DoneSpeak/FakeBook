var express = require('express');
var router = express.Router();
var Post = require('../model/post');
//图片上传
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


//展示朋友们发布的最新7条帖子
router.get('/', function(req, res, next) {
  var userId = req.user.user_id;
  var user = new User({
    user_id : userId
  })
  console.log(req.user);
  Post.getSevenPosts(userId, function(posts){
    console.log("in index.js: 展示帖子数目" + posts.length);
    user.checkFriendRequest(function(friend_requests){
      console.log(friend_requests);
      return res.render('index',{
        posts: posts,
        user: req.user,
        friend_requests : friend_requests
      });
    })
  });

});
//获取更多帖子（翻页）TODO 这里是/post/more
router.get('/more', function(req, res, next){

  var userId = req.user.user_id;
  var lastPost = req.query.last_post_id;
  Post.paging(userId, lastPost , function(posts){
    console.log('in index.js: 翻页，展示了帖子条数' + posts.length);
    res.status(200).json({
      posts: posts
    });
  });
});
// 1. 发布新帖子
router.post('/posts',upload.single('picture'),function(req, res, next){
  console.log('带图片进这个路由')
  console.log(req.body);
  var pictureURL = undefined;
  if(typeof req.file === 'undefined'){
    pictureURL = "";
  }else{
    pictureURL = "/pictures/" + req.file.filename;
  }
  console.log(pictureURL);
  var now = Date.now();
  var post = new Post({
    content: req.body.content,
    visibility: req.body.visibility,
    picture: pictureURL,
    pic_describe: req.body.pic_describe,
    //以上为客户端Ajax发送过来的内容。
    poster: req.user.user_id,
    last_modified_date: now,
    post_date: now
  });
  post.addNewPost(function(){
    console.log('发帖成功!');
    return res.json({
      post_id: post.post_id ,
      picture : post.picture,
      message: "发帖成功",
      post_date: now
    });
  });

});
// 2. 更改帖子
router.put('/posts', function(req, res, next){
  var now = Date.now();
  var post = new Post({
    last_modified_date : now,
    content : req.body.content,
    picture : req.body.picture,
    pic_describe : req.body.pic_describe,
    visibility : req.body.visibility,
    post_id : req.body.post_id
  });
  post.updatePost(function(){
    console.log('更新帖子成功，--需要返回给客户端');
    res.json({
      msg: "更新帖成功"
    });
  });

});
// 3. 删除帖子
router.delete('/posts', function(req, res, next){
  Post.deletePost(req.body.post_id, function(){
    console.log('删除帖子成功');
    res.json({
      msg: "删帖成功"
    });
  });
});

module.exports = router;

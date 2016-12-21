var post = require('./post');
var profile = require('./profile');
var comment = require('./comment');
var subcomment = require('./subcomment');
var like = require('./like')
var login = require('./login');
var register = require('./register')
var friend = require('./friend');
var searchUser = require('./searchUser');

module.exports = function(app){

  app.use('/login', login);
  app.use('/', post); //首页
  app.use('/profile', profile);  //个人页面
  app.use('/comment', comment); //评论
  app.use('/subcomment', subcomment); //子评论
  app.use('/like',like); //喜欢
  app.use('/register', register);
  app.use('/friend', friend);
  app.use('/searchUser',searchUser);

}

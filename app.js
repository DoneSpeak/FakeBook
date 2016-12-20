var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//token
var expressJwt = require("express-jwt");
var jwt = require("jsonwebtoken");

//图片上传
// var multer  = require('multer')
// var upload = multer({ dest: 'public/pictures' });

var app = express();
var route = require('./routes/index');

require('events').EventEmitter.prototype._maxListeners = 100;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//使用JWT
//默认的情况下，解析 JWT 失败会抛出异常，可以通过以下设置来处理该异常。
app.use(expressJwt({
  secret: 'secret',
  // credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({path: ["/login","/register"]}));
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.redirect('/login');
  }
});


// //路由部分。
// app.post('/', upload.single('picture'), function(req, res, next){
//   console.log(req.file);
//   path = req.file.destination+"/"+req.file.filename;
//   path = path.substr(7);
//   // res.json(req.file.destination+"/"+req.file.filename);
//   res.send("<img src='"+path+"'>")
// });

//函数式命名风格，帮我route一下这个app。
route(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

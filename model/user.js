var pool = require('./pool');
var sql = require('./sql');


module.exports = User;

function User(user) {
  this.user_id = user.user_id;
  this.email = user.email;
  this.password = user.password;
  this.register_date = user.register_date;
  this.avatar = user.avatar;
  this.intro = user.intro;
  this.age = user.age;
  this.name = user.name;
  this.sex = user.sex;
}

User.searchUser = function(me, keyword, callback){
  var searchSQL = sql.user.searchUser;
  keyword = "%"+ keyword+ "%";
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    var conn = connection.query(searchSQL,[me,me,keyword,me,me,me, keyword], function(err, rows, fields){
      if(err) throw(err);
      console.log(rows);
      callback(rows);
      console.log(conn.sql);
      connection.release();
    })
  })
}
User.prototype.makeFriendWith = function(anotherUser, callback){
  var loginUser = this.user_id;
  var makeFriendWithSQL = sql.user.makeFriendWith;
  var now = Date.now();
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(makeFriendWithSQL,[loginUser, anotherUser, now], function(err, result){
      if(err) throw(err);
      console.log('in user： 添加好友请求记录成功.');
      callback();
      connection.release();
    })
  })
}

User.prototype.checkFriendRequest = function(callback){
  var user_id = this.user_id;
  var checkFriendRequestSQL = sql.user.checkFriendRequest;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(checkFriendRequestSQL, [user_id, user_id], function(err , rows, fields){
      if(err) throw(err);
      callback(rows);
      connection.release();
    })
  })
}

User.prototype.confirmFriend = function(receiver, callback){
  var confirmFriendSQL = sql.user.confirmFriend;
  var sender = this.user_id;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(confirmFriendSQL,[sender, receiver], function(err, result){
      if(err) throw(err);
      console.log('in user.js: 影响条数:' + result.affectedRows)
      callback();
      connection.release();
    })
  })
}

User.prototype.acceptFriend = function(sender, callback){
  var acceptFriendSQL = sql.user.acceptFriend;
  var receiver = this.user_id;
  console.log(sender+","+receiver);
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(acceptFriendSQL,[sender, receiver], function(err, result){
      if(err) throw(err);
      console.log('in user.js: 影响条数:' + result.affectedRows)
      callback();
      connection.release();
    })
  })
}

User.prototype.rejectFriend = function(sender, callback){
  var rejectFriendSQL = sql.user.rejectFriend;
  var receiver = this.user_id;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(rejectFriendSQL,[sender, receiver], function(err, result){
      if(err) throw(err);
      console.log('in user.js: 影响条数:' + result.affectedRows)
      callback();
      connection.release();
    })
  })
}
User.prototype.updateInfo = function(callback){
  var $this = this;
  var updateSQL = sql.user.updateInfo;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(updateSQL,
    [
      $this.name,
      $this.sex,
      $this.school,
      $this.major,
      $this.intro,
      $this.user_id
    ],function(err, result){
      if(err) throw(err)
      console.log('更新个人信息吃呢公共:'+ result.affectedRows);
      callback();
      connection.release();
    })
  }

}

User.prototype.save = function(callback) {
  //要存入数据库的用户文档,事实上不需要那么多属性，不过反正也用不上。这就是js的神奇。
  var user = {
      user_id: this.user_id,
      email: this.email,
      password: this.password,
      register_date: this.register_date,
      avatar: this.avatar,
      intro: this.intro,
      age: this.age,
      name: this.name,
      sex: this.sex
  };

  var insertOne = sql.user.insertOne;
  pool.getConnection(function(err, connection){
    connection.query(insertOne, [user.name, user.email, user.password, user.register_date], function(err, rows, fields){
      if(err) throw(err);
      console.log("user.js: 插入新用户成功");
      callback();
      connection.release();
    });
  });
};

//读取用户信息
User.get = function(email, callback) {
  var findOne = sql.user.findOneUser;

  pool.getConnection(function(err, connection){
    if(err) throw(err);

    connection.query(findOne,[email],function(err, rows, fields){
      if(err) throw(err);
      if(rows.length === 0) {//找不到用户
        return callback(err,"no user");
      }else{
        var newUser = new User({
          user_id: rows[0].user_id,
          email: rows[0].email,
          password: rows[0].password,
          register_date: rows[0].register_date,
          avatar: rows[0].avatar,
          intro: rows[0].intro,
          age: rows[0].age,
          name: rows[0].name,
          sex: rows[0].sex
        });
        callback(err, "ok", newUser);
        connection.release();

      }
    });
  });


};

var pool = require('./pool');
var sql = require('./sql');


module.exports = Post;

function Post(post){

  this.post_id = post.post_id;
  this.poster = post.poster;
  this.post_date = post.post_date;
  this.last_modified_date = post.last_modified_date;
  this.content = post.content;
  this.picture = post.picture;
  this.visibility = post.visibility;
  this.num_of_like = post.num_of_like;
  this.num_of_comment = post.num_of_comment;
  this.pic_describe = post.pic_describe;

}

Post.getSevenPosts = function(userId, callback){
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    var findAllPostSQL = sql.post.find_7_LastestPost;
    var query = connection.query(findAllPostSQL, [userId, userId, userId], function(err, posts){
      if(err) throw(err);
      callback(posts);
      connection.release();
    });
  });
};

Post.paging = function(userId, lastPost, callback){
  pool.getConnection(function(err, connection){
    if(err) throw(err)
    var nextFivePosts = sql.post.nextFivePosts;
    connection.query(nextFivePosts, [userId, userId, userId, lastPost], function(err, posts){
      if(err) throw(err);
      callback(posts);
      connection.release();
    });
  })
}

Post.prototype.addNewPost = function(callback){
  var $this = this;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    var insertOneSQL = sql.post.insertOne;

    connection.query(
      insertOneSQL,
      [
        $this.poster,
        $this.post_date,
        $this.last_modified_date,
        $this.content,
        $this.picture,
        $this.visibility,
        $this.pic_describe
        ],
       function(err, result){
         if(err) throw(err)
         //获取自增ID，方便传回给客户端。
         console.log('插入成功，自增ID为 '+ result.insertId);
         $this.post_id = result.insertId;
         callback();
         connection.release();
       });
    });
};
Post.prototype.updatePost = function(callback){
  $this = this;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    var updatePostSQL = sql.post.updateOne;
    connection.query(
      updatePostSQL,
      [
        $this.last_modified_date,
        $this.content,
        $this.picture,
        $this.pic_describe,
        $this.visibility,
        $this.post_id
      ],
      function(err, result){
        if(err) throw(err);
        console.log('更新成功,影响条目: '+ result.affectedRows );
        connection.release();
      }
    );
  });
};
Post.deletePost = function(post_id, callback){
  pool.getConnection(function(err, connection){
    var deleteSQL = sql.post.deletePost;
    connection.query(deleteSQL,[post_id], function(err, result){
      if(err) throw(err);
      console.log('删除成功，影响条目：'+ result.affectedRows)
      callback();
      connection.release();
    });
  });
};

var pool = require('./pool');
var sql = require('./sql');


module.exports = Comment;

function Comment(comment){
  this.sender = comment.sender;
  this.comment_id = comment.comment_id;
  this.belong_to_post = comment.belong_to_post;
  this.date = comment.date;
  this.content = comment.content;
  this.num_of_like = comment.num_of_like;
  this.num_of_subcomment = comment.num_of_subcomment;
  this.last_modified_date = comment.last_modified_date;
}

Comment.getLatestComment = function(post_id, callback){

  var findLastestCommentSQL = sql.comment.findLastestComment;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(findLastestCommentSQL,[post_id], function(err, rows, fields){
      if(err) throw(err);
      callback(rows);
      connection.release();
    });
  });
};

Comment.getFiveCommentEarlier = function(post_id, earliestCommentId, callback){

  var getFiveCommentEarlierSQL = sql.comment.findFiveCommentEarlier;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(getFiveCommentEarlierSQL, [post_id, earliestCommentId], function(err , rows, fields){
      if(err) throw(err);
      callback(rows);
      connection.release();
    })
  })

}

Comment.prototype.updateComment = function(callback){
  $this = this;
  var updateSQL = sql.comment.updateOne;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(
      updateSQL,
      [$this.content, $this.last_modified_date,$this.comment_id],
      function(err, result){
        if(err) throw(err);
        console.log("in comment.js:影响记录条数: " + result.affectedRows);
        callback();
        connection.release();
    });

  });
};

Comment.delete = function(comment_id, callback){
  var deleteSQL = sql.comment.deleteOne;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(deleteSQL, comment_id, function(err, result){
      if(err) throw(err);
      connection.release();
      callback();
      console.log("删除成功: 影响条目数" + result.affectedRows);
    });
  });
};

Comment.prototype.newComment = function(callback){
  $this = this;
  var insertOneSQL = sql.comment.insertOne;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    var post_id = $this.belong_to_post;
    connection.query(
      insertOneSQL,
      [
        $this.sender,
        $this.belong_to_post,
        $this.date,
        $this.content,
        $this.last_modified_date],
        function(err, result){
          if(err) throw(err);
          console.log("成功插入数据库, id为：" + result.insertId);
          callback(result.insertId);
          connection.release();
      }
    );
  });
};

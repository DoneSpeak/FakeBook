var pool = require('./pool');
var sql = require('./sql');


module.exports = Subcomment;

function Subcomment(subcomment){
  this.subcomment_id = subcomment.subcomment;
  this.sender = subcomment.sender;
  this.belong_to_comment = subcomment.belong_to_comment;
  this.content = subcomment.content;
  this.date = subcomment.date;
  this.num_of_like = subcomment.num_of_like;
  this.last_modified_date = subcomment.last_modified_date;
}

Subcomment.getSubcomment = function(lastId, comment_id, callback){
  var getSubcommentSQL = sql.subcomment.getSubcomment;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(getSubcommentSQL, [comment_id, lastId], function(err, rows, fields){
      if(err) throw(err);
      callback(rows);

      connection.release();
    });
  });
};

Subcomment.deleteOne = function(subcomment_id, callback){
  var deleteSQL = sql.subcomment.deleteOne;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(deleteSQL, [subcomment_id], function(err, result){
      if(err) throw(err);

      console.log("删除成功，影响条目数"+result.affectedRows);
      callback();
      connection.release();
    });
  });
};

Subcomment.prototype.save = function(callback){
  $this = this;
  var saveSQL = sql.subcomment.insertOne;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(saveSQL, [
      $this.sender,
      $this.belong_to_comment,
      $this.content,
      $this.date,
      $this.last_modified_date
    ] , function(err, result){
      if(err) throw(err);
      callback(result.insertId);
      console.log("插入成功，插入ID"+ result.insertId);
      connection.release();
    });
  });
};
Subcomment.prototype.updateSubcomment = function(callback){
  $this = this;
  var sql = sql.subcomment.updateOne;
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    connection.query(sql, [$this.content, $this.last_modified_date, $this.subcomment_id] , function(err, result){
      if(err) throw(err);
      console.log('subcomment.js: 成功更新子评论')
      callback();
      connection.release();
    });
  });
};

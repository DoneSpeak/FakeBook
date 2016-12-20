var pool = require('./pool');
var sql = require('./sql');

module.exports = Like;

function Like(like){

}
Like.addLike = function(liker, type, post_id, callback){
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    var likeSQL = sql.like.likeOne;
    connection.query(likeSQL, [liker, type, post_id], function(err, result){
      if(err) throw(err);
      console.log('in like.js: 成功插入点赞记录.');
      callback();
      connection.release();
    });
  })

}

Like.cancelLike = function(liker, type, post_id, callback){
  pool.getConnection(function(err, connection){
    if(err) throw(err);
    var cancelLikeSQL = sql.like.cancelLike;
    connection.query(cancelLikeSQL, [liker, type, post_id], function(err, result){
      if(err) throw(err);
      console.log('in like.js: 成功删除点赞记录.');
      callback();
      connection.release();
    })
  })
}

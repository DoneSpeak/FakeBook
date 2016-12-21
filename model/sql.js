
//登陆：
exports.user = {
  insertOne : "insert into user(name, email, password, register_date) values(?, ?, ?, ?)",
  findOneUser : "select * from user where email = ? ",
  makeFriendWith: "insert into friend_request(sender, receiver, date) values(?, ?, ?)",
  checkFriendRequest: "select * from friend_request where (receiver = ? and status ='unhandled') or (sender = ? and status != 'unhandled') ",
  acceptFriend : "update friend_request set status = 'accepted' where sender = ? and receiver = ? ",
  rejectFriend : "update friend_request set status = 'refused' where sender = ? and receiver = ?",
  confirmFriend : "delete from  friend_request where sender = ? and receiver = ?",
  updataInfo: "update user set name = ?, sex = ?, school = ?, major = ?, intro = ? where user_id = ?"
  searchUser: "select U.*, true as is_friend from user U\
               where user_id in (select user_a from friend where user_b = ? UNION select user_b from friend where user_a = ?) and name like ? LIMIT 3\
                UNION\
                (select U.*, false as is_friend from user U\
                where user_id \
                NOT IN (select user_a from friend where user_b = ? UNION select user_b from friend where user_a = ?)\
               and user_id != ? and name like ? LIMIT 4)"
}


exports.post = {
  //尚未考虑生成帖子数量的问题。
  nextFivePosts : 'select name, user_id, avatar, P.* \
                        from user U, Post P \
                        where poster = user_id \
                        and (\
                        (U.user_id in ( select user_a from friend where user_b = ? \
                        UNION select user_b from friend where user_a = ? ) \
                        and (visibility = \'public\' or visibility = \'friend\')) \
                        or poster = ?) \
                        and post_id < ? \
                        order by post_date DESC limit 5',

  findAllPostSQL : 'select name, user_id, avatar, P.* \
                        from user U, Post P \
                        where poster = user_id \
                        and user_id = ?\
                        and post_id < ? \
                        order by post_date DESC limit 5',

  insertOne : "insert into post(poster, post_date, last_modified_date, \
              content, picture, visibility, pic_describe) \
              values(?, ?, ?, ?, ?, ?, ?)",

  updateONe: "update post set last_modified_date = ?,\
              content = ?, picture = ?, pic_describe = ?,\
              visibility = ? where post_id = ?" , //共6个参数。

  deletePost: "delete from post where post_id = ?",

  find_7_LastestPost : 'select name, user_id, avatar, P.* \
                        from user U, Post P \
                        where poster = user_id \
                        and (\
                        (U.user_id in ( select user_a from friend where user_b = ? \
                        UNION select user_b from friend where user_a = ? ) \
                        and (visibility = \'public\' or visibility = \'friend\')) \
                        or poster = ?) \
                        order by post_date DESC \
                        limit 7'
 }
exports.like = {
  likeOne : "insert into praise(liker, type, post_id) values(?, ?, ?)",
  cancelLike : "delete from praise where liker = ? and type = ? and post_id ?"
}
exports.comment = {
   findLastestComment: "select user_id, name, avatar, comment_id, date, content, num_of_like, num_of_subcomment \
                             from comment C, user U \
                             where C.sender = U.user_id \
                             and belong_to_post = ? \
                             order by date DESC \
                             limit 7",
   findFiveCommentEarlier: "select user_id, name, avatar, comment_id, date, content, num_of_like, num_of_subcomment \
                             from comment C, user U \
                             where C.sender = U.user_id \
                             and belong_to_post = ? \
                             and comment_id < ? \
                             order by date DESC \
                             limit 5",

   insertOne: "insert into comment(sender, `belong_to_post`, date, content, last_modified_date) \
                values(?, ?, ?, ?, ?)",
   updateOne : "update comment set content = ?, last_modified_date = ? where comment_id = ?",
   deleteOne : "delete from comment where comment_id = ?"

 }
 exports.subcomment = {
   getSubcomment: "select user_id, name, avatar, subcomment_id, date,\
                  content, num_of_like from subcomment S,user U\
                  where belong_to_comment = ? and subcomment_id < ?\
                  and user_id = sender\
                  order by date DESC \
                  limit 5",   //经测试 OK
   insertOne: "insert into subcomment(sender, belong_to_comment, content,\
      date, last_modified_date) values(?, ?, ?, ?, ?)" , //共5个参数。

   updateOne: "update subcomment set content = ?, \
              last_modified_date = ? \
              where subcomment_id = ?",
   deleteOne: "delete from subcomment where subcomment_id = ?"
 }

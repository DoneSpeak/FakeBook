插入user_15的好友关系
INSERT INTO `friend` (`userA`, `userB`, `make_friend_date`) VALUES ('0000000015', '0000000016', '0'), ('0000000015', '0000000017', '0');
INSERT INTO `friend` (`userA`, `userB`, `make_friend_date`) VALUES ('0000000015', '0000000018', '0'), ('0000000015', '0000000019', '0');
INSERT INTO `friend` (`userA`, `userB`, `make_friend_date`) VALUES ('0000000015', '0000000020', '0'), ('0000000015', '0000000021', '0');

插入一些用户的post
INSERT INTO `post` (`post_id`, `poster`, `post_time`, `last_modified_time`, `content`, `picture`, `visibility`, `num_of_like`, `num_of_comment`) VALUES ('1', '0000000016', '0', '0', 'say something', NULL, 'public', '100', '9');
INSERT INTO `post` (`post_id`, `poster`, `post_time`, `last_modified_time`, `content`, `picture`, `visibility`, `num_of_like`, `num_of_comment`) VALUES ('2', '0000000017', '0', '0', 'say something else', NULL, 'public', '3', '9');
INSERT INTO `post` (`post_id`, `poster`, `post_time`, `last_modified_time`, `content`, `picture`, `visibility`, `num_of_like`, `num_of_comment`) VALUES ('3', '0000000018', '0', '0', '你们都那么棒', NULL, 'public', '2', '9');
INSERT INTO `post` (`post_id`, `poster`, `post_time`, `last_modified_time`, `content`, `picture`, `visibility`, `num_of_like`, `num_of_comment`) VALUES ('4', '0000000019', '0', '0', '采菊东篱下，悠然见南山', NULL, 'public', '999', '999');

插入一些评论
INSERT INTO `comment` (`sender`, `comment_id`, `belong_to_post`, `date`, `content`, `num_of_like`, `num_of_subcomment`, `last_modified_date`) VALUES ('0000000015', '1', '0000000001', '0', '你说的很对', '0', '0', '0'), ('0000000017', '2', '0000000001', '0', '楼上+1', '0', '0', '0');
INSERT INTO `comment` (`sender`, `comment_id`, `belong_to_post`, `date`, `content`, `num_of_like`, `num_of_subcomment`, `last_modified_date`) VALUES ('0000000018', '3', '0000000001', '0', '你说的很对', '0', '0', '0'), ('0000000019', '4', '0000000001', '0', '楼下都是傻子吗', '0', '0', '0');

插入一些子评论
INSERT INTO `subcomment` (`subcomment_id`, `sender`, `belong_to_comment`, `content`, `date`, `num_of_like`, `last_modified_date`) VALUES ('1', '0000000016', '0000000001', '我要打你了哦，你不听话', '1', '0', '1');
INSERT INTO `subcomment` (`subcomment_id`, `sender`, `belong_to_comment`, `content`, `date`, `num_of_like`, `last_modified_date`) VALUES ('2', '0000000017', '0000000001', '嘻嘻，你不听话', '2', '0', '2')


创建点赞触发器
  1.自增。
CREATE TRIGGER num_of_like_autoincrement
AFTER INSERT
ON praise
FOR EACH ROW
BEGIN
    IF (NEW.type = 'post')
    THEN
        UPDATE post set num_of_like = num_of_like +1 where post_id = new.post_id;
    ELSEIF (NEW.type = 'comment')
    THEN
        UPDATE comment set num_of_like = num_of_like +1 where comment_id = new.post_id;
    ELSEIF (NEW.type = 'subcomment')
    THEN
    	UPDATE subcomment set num_of_like = num_of_like +1 where subcomment_id = new.post_id;
    END IF;
END;//

  2.自减
CREATE TRIGGER num_of_like_autodecrement
AFTER delete
ON praise
FOR EACH ROW
BEGIN
    IF (old.type = 'post')
    THEN
        UPDATE post set num_of_like = num_of_like -1 where post_id = old.post_id;
    ELSEIF (old.type = 'comment')
    THEN
        UPDATE comment set num_of_like = num_of_like -1 where comment_id = old.post_id;
    ELSEIF (old.type = 'subcomment')
    THEN
    	UPDATE subcomment set num_of_like = num_of_like -1 where subcomment_id = old.post_id;
    END IF;
END;//


创建评论触发post的num_of_comment自增触发器
CREATE TRIGGER num_of_comment_autoIncrement
after INSERT
on comment
for EACH ROW
BEGIN
update post set num_of_comment = num_of_comment +1;
END; //

删除评论触发post的num_of_comment自减触发器（同时删除所有赞）
CREATE TRIGGER `num_of_comment_autoDecrement`
AFTER DELETE ON `comment`
FOR EACH ROW
BEGIN
update post set num_of_comment = num_of_comment -1 where old.belong_to_post = post.post_id;
delete from praise where post_id = old.comment_id and type='comment';
END

//删除子评论同时删除点赞记录，并将对应评论的num_of_subcomment减1
CREATE TRIGGER `num_of_subcomment_AD_and_delete_praises` AFTER DELETE ON `subcomment` FOR EACH ROW BEGIN update comment set num_of_comment = num_of_comment - 1; delete FROM praise where type='subcomment' and post_id = subcomment_id; END;

//添加好友触发器
CREATE TRIGGER make_friend
after DELETE
on friend_request
FOR EACH ROW
BEGIN
	IF (old.status = 'accepted')
    THEN
    	INSERT INTO friend(user_a,user_b,date) VALUES(old.sender, old.receiver, old.date);
    END IF;
END;//

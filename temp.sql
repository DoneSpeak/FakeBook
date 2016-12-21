<!-- <%- include("components/comment")%> -->
<!-- <%- include("components/morecomments.ejs") %> -->

SELECT * from user U, post P where poster = user_id and (
    (user_id IN ( SELECT user_a from friend where user_b = '0000000016'
	UNION select user_b from friend where user_a = '0000000016')
    and visibility = 'public' or visibility = 'friend' )
    or poster = '0000000016')
    order by post_date DESC limit 7;


原sql:
    find_7_LastestPost : "select user_id, name, avatar, post_id,\
                post_date, last_modified_date, content,\
                picture, visibility, pic_describe, num_of_like, num_of_comment \
                from post P,friend F,user U \
                where  (( \
                  (F.user_a = ? and P.poster = F.user_b and F.user_b = U.user_id) \
                or (F.user_b = ? and P.poster = F.user_a and F.user_a = U.user_id)\
                and P.visibility = 'public' or 'friend' ) \
                or P.poster = ?) \
                and U.user_id = P.poster \
                order by post_date DESC limit 15 "



所有朋友：
select U.*, 1 as is_friend from user U
              where user_id in (select user_a from friend where user_b = 22 UNION select user_b from friend where user_a = 22)


              select U.*, 1 as is_friend from user U
                where user_id in (select user_a from friend where user_b = 22 UNION select user_b from friend where user_a = 22) LIMIT 3
                              UNION
                                (select U.*, 2 as is_friend from user U
                                              where user_id NOT IN (select user_a from friend where user_b = 22 UNION select user_b from friend where user_a = 22) and user_id != 22 LIMIT 4)

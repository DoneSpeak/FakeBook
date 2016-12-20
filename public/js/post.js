var token = window.localStorage.getItem('token');
if(token){
	$.ajaxSetup({
		beforeSend: function (xhr) {
			xhr.setRequestHeader("token", 'Bearer '+ token);
		},
		headers: {
				 'x-access-token': 'Bearer ' + token,
				 'authorization':  'Bearer ' + token
			 }
	});
}
$(function(){
  //  editor 编辑器相关事件
  // 激活flexText插件
  $('#editor-content').flexText();
  $('.discrip-img-input').flexText();
  $('.comment-editor').flexText();
  $('.subcomment-input').flexText();
  // autosize(document.querySelectorAll('textarea'));
  // 监督editor输入框，实时修改字体大小
  function changeFontSize(){
    var num=$('#editor-content').val().length;
    // alert(num);
    if(num <= 80){
      $('.post-input').removeClass('small-font');
      $('.post-input').addClass('middle-font');
    }else{
      $('.post-input').removeClass('middle-font');
      $('.post-input').addClass('small-font');
    }
  };

  function clearFlex($wrap){
    // alert($wrap.val());
    // alert($wrap.closest('.flex-text-wrap').find('span').text());
    $wrap.val("");
    $wrap.closest('.flex-text-wrap').find('span').text("");
  }

//
  $('.visibility-item').on('click',function(){
    var btngroup = $(this).closest('.btn-group');
    var whoview = btngroup.find('.whoview').find('.visibility-item');
    var tempHtml = $(this).html();
    $(this).html(whoview.html());
    whoview.html(tempHtml);
  });
  // 输入
  $(".post-input").on('keyup',changeFontSize);
  // 粘贴
  $(".post-input").on('paste',changeFontSize);

  // 添加图片的label
  $('.img-upload-label').on('click',function(){
    // $('.file-tab').css('display','block');
  });

  // 添加的图片上的编辑区域 事件
  $('.file-tab').on('mouseover',function(){
    $('.img-btn-area').css('display','block');
  });
  $('.file-tab').on('mouseout',function(){
    $('.img-btn-area').css('display','none');
  });

  // 点击发布按钮
  $('.btn-submit').on('click',function(){
    // 获取发布的内容
    var post_content = $('#editor-content').val();
    var file_img = $('#img-upload')[0].files[0];
    console.log(file_img);
    // [change] 如果需要更换成div实现，则需要需要给为 text
    var img_descript = $('.discrip-img-input').val();

    if( (!post_content || post_content.length == 0 ) && (!file_img || file_img.length == 0) ){
      alert('内容为空');
      return;
    }

    var post = {
      user_id:"",
      name:"",
      avatar:"",

      post_id:"",
      post_date:"",
      content:"",
      visibility:"",
      picture:"",
      pic_describe:""
    }
    var $me = $('#me');
    post.avatar = $me.attr('src');
    post.name = $me.data('me-name');
    post.user_id = $me.data('me-uid');

// pid，picture 需要从服务器端插入成功后返回
    post.post_date = "刚刚";
    post.content = post_content;
    // post_content = post_content.replace(/ /g, "&nbsp;");
    // alert(post.content);
    post.visibility = $('.whoview').find('.visibility-item').find('span').data('visibility');
    post.picture = '';
    console.log('visibility', post.visibility);
    post.pic_describe = img_descript;

  // ajax 异步传递给后台
    var formData = new FormData();
    formData.append('content', post.content);
    //[caren]
    formData.append('visibility', post.visibility);
    formData.append('picture', file_img);
    formData.append('pic_describe', post.pic_describe);
    $.ajax({
      url: '/posts',
      type: 'POST',
      cache: false,
      data: formData,
      processData: false,
      contentType: false,
      success:function(res) {
        post.post_id = res.post_id;
        post.picture = res.picture;
        post.timestamp = res.post_date;

        //[TODO] 格式化时间

        console.log(post);


        var post_creator = new Post_creator(post);
        post_creator.create_post();
        post_creator.show_post();

        // 移除输入框内容
        $('.discrip-img-input').val("");
        clearFlex($('#editor-content'));
        // 清空file
        var $file = $("#img-upload")
        $file.after($file.clone().val(""));
        $file.remove();
        // 移除图片显示
        $('.file-tab').find('.img-thumbnail').remove();
        $('.discrip-img').css('display','none');
        $('.file-tab').css('display','none');
        // 模态框消失
        $('.modal-all').click();

      },
      error:function(res) {
        alert('发布失败');
      }
    });
  });

  // ----------------------- 展开内容 -----------------
  $(document).on('click','.see-more-link',function(){
    var $content = $(this).closest('.content');
    var content = $(this).data('more-content');
    $(this).remove();
    $content.text($content.text() + content);
  });

  // ---------------------- 查看更多贴子 --------------
  $(document).on('click','.see-more-post',function(){
    var $all_post = $('.all-posts');
    var last_id = $all_post.attr('data-last-pid');

    var $see_more = $(this);
    // ajax 请求几条post
    $.ajax({
      url:'/more',
      type:'GET',
      data:{
        last_post_id:last_id
      },
      success:function(res){
        var posts = res.posts;
        if(posts.length <= 0){
          $see_more.css('display','none');
        }

        $all_post.attr('data-last-pid',posts[posts.length-1].post_id);
        
        posts.forEach(function(post){
          var post_creator = new Post_creator(post);
          post_creator.create_post();
          post_creator.show_post_end();
        });


      },
      error:function(res){
        // alert('请求失败');
        alert(res.message);
      }
    });
  });

  // ---------------------- 查看更多评论 --------------
  $(document).on('click','.see-more-comments',function(){
    var last_comment_id = $(this).data('last-cid');
    var $singlepost = $(this).closest('.single-post');
    var post_id = $singlepost.data('post-pid');

    var $see_more = $(this);
    var cur_comments_num = $see_more.data('cur-num');
    var all_comments_num = $see_more.data('all-num');
    if(cur_comments_num === all_comments_num){
      // 已经到底部，不再加载
      return;
    }

    // [TODO] 显示加载中提示动画
    // ajax 请求更多消息
    $.ajax({
      url:'/comment',
      type:'GET',
      data:{
        post_id:post_id,
        last_comment_id:last_comment_id
      },
      success:function(res){
        var comments = res.comments;
        var num_of_comment = res.num_of_comment;

        var $comment_anchor = $singlepost.find('.comments-anchor');

        comments.forEach(function(comment){
          //[NEED] comment 顺序要求 -- 从旧到新 -- 因为要先插入旧的
          var comment_creator = new Comment_creator(comment);
          comment_creator.create_comment();
          comment_creator.show_comment_before($comment_anchor);
        });
        // 判断是否已经全部获取more-comment-div
        if(num_of_comment <= all_comments_num){
          // 已经全部获得
          $see_more.text("已加载所有之前评论");
          return;
        }

        // 更新数据
        $see_more.attr('data-last-cid',comments[comments.length - 1].date);
        $see_more.attr('data-cur-num',cur_comments_num * 1 + comments.length);
        $see_more.attr('data-all-num',num_of_comment);
        // [TODO] 数值格式化
        $see_more.next('span').text(cur_comments_num + " / " + all_comments_num);
      },
      error:function(res){
        alert('请求失败');

      }
    });
  });

  // ---------------------- 查看更多 子评论 ----------
  $(document).on('click','see-more-subcomment',function(){
    var last_subcomment_id = $(this).data('last-cid');
    var $singlecomment = $(this).closest('.single-comment');
    var comment_id = $singlecomment.data('comment-id');

    var $see_more = $(this);
    var cur_subcomments_num = $see_more.data('cur-num');
    var all_subcomments_num = $see_more.data('all-num');
    if(cur_subcomments_num === all_subcomments_num){
      // 已经加载所有
      // 更多回复隐藏
      $(this).css('display','none');
      return;
    }

    // [TODO] 显示加载中提示动画
    // ajax 请求更多消息
    $.ajax({
      url:'/subcomment',
      type:'GET',
      data:{
        comment_id:comment_id,
        last_subcomment_id:last_subcomment_id
      },
      success:function(res){
        var subcomments = res.subcomments;
        var num_of_subcomment = res.num_of_subcomment;

        var $all_subcomments = $singlecomment.find('.all-subcoments');

        subcomments.forEach(function(subcomment){
          //[NEED] comment 顺序要求 -- 从旧到新 -- 因为要先插入旧的
          var subcomment_creator = new Subcomment_creator(subcomment);
          subcomment_creator.create_subcomment();
          subcomment_creator.show_subcomment_after($all_subcomments);
        });
        // 判断是否已经全部获取more-comment-div
        if(num_of_subcomment <= all_subcomments_num){
          // 已经全部获得
          $see_more.css('display','none');
          return;
        }
        // 更新数据
        $see_more.attr('data-last-cid',subcomments[subcomments.length - 1].subcomment_id);
        $see_more.attr('data-cur-num',cur_subcomments_num * 1 + subcomments.length);
        $see_more.attr('data-all-num',num_of_subcomment);
        // [TODO] 数值格式化
        $see_more.find('span').text(all_subcomments_num - cur_subcomments_num);
      },
      error:function(res){
        alert('请求失败');

      }
    });
  });

  // ----------------------- 添加事件 ------------------
  function addSeeMoreComments($place,last_comment_id, cur_comments_num, all_comments_num){
    var html = [];
    html.push('<div class="more-comment-div">');
    html.push('<a class="see-more-comments" href="javascript:void(0)" data-last-cid="' + last_comment_id + '" data-cur-num="' + cur_comments_num + '" data-all-num="' + all_comments_num + '">查看更多评论</a>');
    //[TODO] 数值格式化
    html.push('<span class="pull-right">' + cur_comments_num + ' / ' + all_comments_num + '</span>');
    html.push('</div>');
    $place.after(html.join(''));
  }
// 点击评论，聚焦输入框
  $(document).on('click','.post-comment',function(){
    // 找到输入框的位置
    var $singlepost = $(this).closest('.single-post');
    // var inputArea = singlepost.find('.comment-input');
    var $editor = $singlepost.find('.comment-editor');
    var commentsArea = $singlepost.find('.all-comments');
    // 显示评论区域
    commentsArea.css('display','block');
    //[TODO] 显示加载中效果
    // 输入框聚焦
    $editor.focus();

    //判断是否已经加载了评论，有则放弃之后的加载，否则请求加载
    if( commentsArea.children('.single-comment').length >= 1){
      return;
    };

    var me = {};
    me.avatar = $('#me').attr('src');

    var post_id = $singlepost.data('post-pid');
    // alert(post_id);
    var last_comment_id = -1;

    // 请求十条评论、总评论数，每条评论的子评论数，判断是否显示加载更多
    $.ajax({
      url:'/comment',
      type:'GET',
      data:{
        post_id:post_id,
        last_comment_id:last_comment_id
      },
      success:function(res){
        var comments = res.comments;
        var num_of_comment = res.num_of_comment;
        // alert(num_of_comment);

        var $comment_anchor = commentsArea.find('.comments-anchor');

        comments.forEach(function(comment){
          //[NEED] comment 顺序要求 -- 从旧到新 -- 因为要先插入旧的
          var comment_creator = new Comment_creator(comment,me);
          comment_creator.create_comment();
          comment_creator.show_comment_before($comment_anchor);
        });
        if(num_of_comment > comments.length){
          // 插入“查看更多评论”模块
          addSeeMoreComments($comment_anchor, comments[comments.length - 1].date, comments.length, num_of_comment);
        }
      },
      error:function(res){
        alert('请求失败');
      }
    });

  });

// 一级回复
  $(document).on('keydown','.comment-editor',function(event){
    if(event.keyCode !== 13){
      return event.returnValue=true;
    }
    // 获取输入框内容
    var content = $(this).val();
    // 判断是否有内容
    if(content.length < 1){
      alert("内容为空");
      $(this).val("");
      return event.returnValue=false;
    }

    var comment = {
      uid:"",
      name:"",
      avatar:"",

      cid:"",
      timestamp:"",
      date:"",
      content:""
    };
    // cid 需要从服务器获得

    var $me = $('#me');
    comment.uid = $me.data('me-uid');
    comment.name = $me.data('me-name');
    comment.avatar = $me.attr('src');

    var me = {};
    me.avatar = $me.attr('src');

    comment.content = content;

    $singlepost = $(this).closest('.single-post');
    var post_id = $singlepost.data('post-pid');
    // alert(post_id);
    // alert(content);
    // 提交成功后生成留言图标
    $comment_editor = $(this);
    $.ajax({
      url: '/comment',
      data: {
        content:comment.content,
        post_id:post_id
      },
      type: 'POST',
      success:function(res) {
        comment.cid = res.comment_id;
        comment.timestamp = res.date;

        //[格式化] comment.date = [格式化]

        // 找到评论的锚点
        $comment_anchor = $comment_editor.closest('.all-comments').find('.comments-anchor');

        // 获取相关数据
        var comment_creator = new Comment_creator(comment,me);
        comment_creator.create_comment();
        comment_creator.show_comment_after($singlepost.find('.comment-input'));

        clearFlex($comment_editor);
        // 输入框内容清空
        // $(this).val("");
      },
      error:function(res) {
        alert('发布失败');
        return event.returnValue=false;
      },
      done:function(res){
        console.warning(res);
      }
    });

    return event.returnValue=false;
  });

// 点击回复，第二级回复
  $(document).on('click','.sub-reply',function(){

    // 找到该元素所属的 media-body
    var $mediabody = $(this).closest('.media-body');
    var $singlecomment = $(this).closest('.single-comment');

// 显示所有评论
    var $subcoments_all = $mediabody.find('.all-subcoments');
    $subcoments_all.css('display','block');

    var cid = $singlecomment.data('comment-id');

    var $for_comment = $mediabody.find('.for-comment');
    $for_comment.css('display','none');
    // for_comment.attr('data-for-comment',cid);
    $for_comment.attr('data-for-comment',cid);

    $for_comment.text('');
    // 输入框聚焦
    var $subinput = $mediabody.find('.subcomment-input');
    $subinput.focus();
    // 屏幕移动
    // 请求十条评论信息
    // 动态添加
  });

  // 提交二级回复内容
  $(document).on('keydown','.subcomment-input',function(event){
    if(event.keyCode !== 13){
      return event.returnValue=true;
    }
    // 获取输入框内容
    var content = $(this).val();
    // 判断是否有内容
    if(content.length < 1){
      alert("内容为空");
      $(this).text("");
      return event.returnValue=false;
    }
//[start] 与comment部分相同

    var comment = {
      uid:"",
      name:"",
      avatar:"",

      cid:"",
      date:"",
      content:"",
      towho:""  //回复谁
    };

    var $me = $('#me');
    comment.uid = $me.data('me-uid');
    comment.name = $me.data('me-name');
    comment.avatar = $me.attr('src');

    var me = {};
    me.avatar = $me.attr('src');

    comment.content = content;

    var $subcomment_editor = $(this).closest('.subcomment-editor');
    var $for_comment = $subcomment_editor.find('.for-comment');

    comment.towho = $for_comment.text();

    // 获取所评论的评论的id，回复对象，回复comment_id

    $singlecomment = $(this).closest('.single-comment');
    var comment_id = $singlecomment.data('comment-id');
    var $subcomment_input = $(this);
    $.ajax({
      type:"POST",
      url:'/subcomment',
      data:{
        comment_id: comment_id,
        content: comment.content
      },
      success:function(res){
         // 成功获取数据，将评论加上去


        comment.cid = "从服务器获得";
        //[TODO] 格式化
        comment.date = "刚刚";

        var subcomment_creator = new Subcomment_creator(comment,me);
        subcomment_creator.create_subcomment();

        subcomment_creator.show_subcomment_before($subcomment_editor);

        // 输入框内容清空
        // $(this).val("");
        clearFlex($subcomment_input);
        // for-comment 清空
        $for_comment.text('');
        $for_comment.attr('data-for-comment',"");
        $for_comment.css('display','none');
      },
      error:function(res){
        //错误提示
        alert('服务器错误，请稍后再试！');
      }
    });
    return event.returnValue=false;
  });

// 第三级回复
  $(document).on('click','.sub-sub-reply',function(){
    var sub_mediabody = $(this).closest('.media-body');
    var rep_commenter = sub_mediabody.find('.commenter');
    var cid = sub_mediabody.data('comment-id');
    var name = rep_commenter.text();

    var allcomments = $(this).closest('.all-subcoments');

    var $for_comment = allcomments.find('.for-comment');
    $for_comment.css('display','inline');
    $for_comment.attr('data-for-comment',cid);
    $for_comment.text("回复 " + name);
    var subinput = allcomments.find('.subcomment-input');
    // 设置聚焦
    subinput.focus();
  });



  // ---------------------- 编辑 -----------------------
  $(document).on('click','.post-edit',function(){
// 仅仅支持文本的编辑，暂时不支持图片的编辑
  // 关闭其他的编辑器
  var $allposts = $(this).closest('.all-posts');
  // var $allposts.find('.post-updater');

  // 获取帖子所有的文本，包含隐藏在see-more-kink中的内容
  // 隐藏p标签
  // 更换成textarea
  // 将内容附上

  });

  function changeCommentToTextarea($place, content){
    var me = $('#me');
    var img = me.attr('src');
    var html = [];
    html.push('<div class="update-comment"><img class="pull-left img-mid" src="' + img + '" />');
    html.push('<div class="comment-editor-div">');
    html.push('<textarea class="comment-updater" placeholder="写评论...">' + content + '</textarea>');
    html.push('</div></div>');
    $place.prepend(html.join(''));
    $place.find('.comment-updater').flexText();
  }

  // 显示编辑样式
  $(document).on('click','.comment-edit',function(){

    var $singlecomment = $(this).closest('.single-comment');
    // 先关闭其他的编辑框
    // 由于编辑一个，其他comment的编辑区就会关闭，所以只会有一个
    var $update_comment = $singlecomment.closest('.single-post').find('.update-comment');
    // $update_comment
    // 显示原来被编辑的内容，并移除编辑框

    if($update_comment.length >= 1){
      $update_comment.closest('.single-comment').find('.comment-editable-hide').css('display','block');
      $update_comment.closest('.single-comment').find('.media-left').css('display','table-cell');
      $update_comment.remove();
    }else{
      // alert("不存在");
    }

    // 获取当前的文本内容
    var content = $singlecomment.find('.comment-content').text();

    // 相关标签隐藏
    // alert($singlecomment.find('.comment-editable-hide').length);
    $singlecomment.find('.comment-editable-hide').css('display','none');
    // 插入标签<textarea></textarea>，并添加内容，激活高度自适应方法
    changeCommentToTextarea($singlecomment, content);
    // 填充所获得的文本内容到<pre><span></span><br /></pre>中
    // 剩下的交给下一个监控enter键的函数
  });
  // 监控评论编辑框，用户按下enter键
  $(document).on('keydown','.comment-updater',function(event){
    if(event.keyCode !== 13){
      return event.returnValue=true;
    }
    comment_id = $(this).closest('.single-comment').data('comment-id');
    // 获取输入框内容
    var content = $(this).val();
    if(content.length < 1){
      alert("内容为空");
      $(this).val("");
      return event.returnValue=false;
    }

    $comment_updater = $(this);

    $.ajax({
      url:'/comment',
      type:'PUT',
      data:{
        comment_id:comment_id,
        content:content
      },
      success:function(res){
        // 成功后将内容填入，移除textarea
        var $singlecomment = $comment_updater.closest('.single-comment');
        var $update_comment = $comment_updater.closest('.update-comment');

        $singlecomment.find('.comment-editable-hide').css('display','block');
        $singlecomment.find('.media-left').css('display','table-cell');
        // 数据填充
        $singlecomment.find('.comment-content').text(content);
        $update_comment.remove();
      },
      error:function(res){
        alert("编辑失败: " + res.message);
      }
    });
  });

  // ---------------------- 删除 -----------------------
  // 删除帖子
  $(document).on('click','.post-delete',function(){
    // [TODO] 模态框提示
    alert('[这是模态框确认]：你确定要删除吗？');
    var $singlepost = $(this).closest('.single-post')
    var post_id = $singlepost.data('post-pid');

    $.ajax({
      url:'/posts',
      type:'delete',
      data:{
        post_id:post_id
      },
      success:function(res){
        // alert("删除成功");
        // 移除帖子
        $singlepost.fadeOut();
      },
      error:function(res){
        // 在导航栏下显示错误信息
        alert("[这是导航栏下错误提示]：删除失败");
        // alert("删除失败");
        $singlepost.fadeOut();
      }
    });
  });

  // 删除评论
  $(document).on('click','.comment-delete',function(){
    // [TODO]
    alert('[这是模态框确认]：你确定要删除吗？');

    var $comment = $(this).closest('.single-comment');
    var comment_id = $comment.data('comment-id');

    $.ajax({
      url:'/comment',
      type:'DELETE',
      data:{
        comment_id:comment_id
      },
      success:function(res){
        alert("删除成功" + res.message);
        // 移除帖子
        $comment.remove();
      },
      error:function(res){
        // 在导航栏下显示错误信息
        alert("[这是导航栏下错误提示]：删除失败");
        // alert("删除失败");
        $comment.remove();
      }
    });
  });

   // 删除子评论
  $(document).on('click','.subcomment-delete',function(){
    // [TODO]
    alert('[这是模态框确认]：你确定要删除吗？');

    var $subcomment = $(this).closest('.single-subcomment')
    var subcomment_id = $subcomment.data('subcomment-id');

    $.ajax({
      url:'/subcomment',
      type:'DELETE',
      data:{
        subcomment_id:subcomment_id
      },
      success:function(res){
        $subcomment.remove();
        alert("删除成功" + res.message);
      },
      error:function(res){
        // 在导航栏下显示错误信息
        alert("[这是导航栏下错误提示]：删除失败");
        $subcomment.remove();
      }
    });
  });

});

  // ---------------------- 对象 -----------------------

//对象继承方法 使用空对象做中介,空对象不需资源
function extend(Child, Parent) {
　var F = function(){};
　F.prototype = Parent.prototype;
　Child.prototype = new F();
　Child.prototype.constructor = Child;
　//直接指向父对象的prototype属性
　//实现继承的完备性，纯属备用性质
　Child.super = Parent.prototype;
}

// 帖子创建者对象

// var post = {
//   user_id:"",
//   name:"",
//   avatar:""

//   post_id:"",
//   content:"",
//   visibility:"",
//   picture:"",
//   pic_describe:""
// }
function Post_creator(post){
  this.post = post;
  this.post_html = "";
  this.max_content_length = 300;
}

Post_creator.prototype.create_post = function(){
    this.post_html = this.create_post_html();
}

Post_creator.prototype.show_post = function(){
  $('.all-posts').prepend(this.post_html);
  $("#" + this.post.pid ).find('.comment-editor').flexText();
  if(typeof this.post.picture === 'undefined' || this.post.picture.length <= 0){
    return;
  }
  $(".lightbox_image").lightbox({
    fixed: true
  });
}

Post_creator.prototype.show_post_end = function(){
  $('.all-posts').append(this.post_html);
  $("#" + this.post.pid ).find('.comment-editor').flexText();
  if(typeof this.post.picture === 'undefined' || this.post.picture.length <= 0){
    return;
  }
  $(".lightbox_image").lightbox({
    fixed: true
  });
}

Post_creator.prototype.create_post_html = function(){
  var post_html = [];
  post_html.push('<div class="single-post" data-post-pid="' + this.post.post_id + '" data-poster-uid="' + this.post.user_id + '">');
  post_html.push('<div class="post-main">');
  post_html.push(this.create_post_head());
  post_html.push('<div class="clear"></div>');
  post_html.push('<p class="post-content content">');
  if(this.post.content.length > this.max_content_length){
    var content_show = this.post.content.substring(0,this.max_content_length);
    var content_hide = this.post.content.substring(this.max_content_length,this.post.content.length);
    post_html.push(content_show);
    post_html.push('...<a class="see-more-link" href="javascript:void(0)" data-more-content="'+ content_show + '">展开</a>');
  }else{
    post_html.push(this.post.content);
  }
  post_html.push('</p>');

  var poster_homepage = '' + this.post.uid;
  var url_like = '' + this.post.uid;
  var url_reply = '' + this.post.uid;
  var post_url = '' + this.post.pid;

  // 图片
  if(typeof this.post.picture !== 'undefined' && this.post.picture.length > 0){
    post_html.push('<div class="post-img">');
    post_html.push('<a href="' + this.post.picture + '"');
    post_html.push('class="lightbox_image js-lightbox fs-lightbox-element"');
    post_html.push('data-lightbox-gallery="gallery_fixed" ');
    post_html.push('data-lightbox-options=\'{"fixed":false}\' ');
    post_html.push('data-title="<a class=\'poster\' href=\'' + poster_homepage + '\'>' + this.post.name + '</a> <a class=\'post-link\' href=\'' + post_url + '\'>');
    post_html.push('<time data-datetime=\'' + this.post.date + '\' data-timestamp=\'' + this.post.timestamp + '\' >' + this.post.date + '</time></a><br/>' + this.post.pic_describe + '"');
    post_html.push('title="' + this.post.pic_describe + '">');
    post_html.push('<img src="' + this.post.picture + '">');
    post_html.push('</a></div>'); // end of post-img
  }
  // 操作
  post_html.push('<div class="post-operation">');
  post_html.push('<a class="post-operation-like" href="javascript:void(0)"><span class="glyphicon glyphicon-thumbs-up"></span> 赞 </a>');
  post_html.push('<a class="post-comment" href="javascript:void(0)">');
  post_html.push('<span class="glyphicon glyphicon-comment"></span> 评论</a>');
  post_html.push('<a href="javascript:void(0)" class="post-operation-share"><span class="glyphicon glyphicon-share"></span> 分享</a>');
  if(this.post.num_of_comment > 0){
    post_html.push('<span class="pull-right"><a href="javascript:void(0)">3,101条评论</a> <a href="javascript:void(0)">1.3万次分享</a></span>');
  }
  post_html.push('</div></div>');
  // clearfixed
  post_html.push('<div class="clear"></div>');
  // 评论
  post_html.push('<div class="all-comments">');
  post_html.push('<div class="comment-input">');
  post_html.push('<img class="pull-left img-mid" src="' + this.post.avatar + '" />');
  post_html.push('<div class="comment-editor-div"><textarea class="comment-editor" placeholder="写评论..."></textarea></div>');
  post_html.push('</div>');
  post_html.push('<div class="clear comments-anchor"></div></div>');
  return post_html.join("");
}

Post_creator.prototype.create_post_head = function(){

  var post_url = '' + this.post.pid;
  var poster_homepage = '' + this.post.uid;

  var info_html = [];
  info_html.push('<div class="post-head">');
  info_html.push('<div class="post-info pull-left">');
  info_html.push('<a class="post-user" tabindex="0"  data-toggle="popover" data-trigger="focus"  role="button" data-placement="top" data-content="<button class=\'btn-add-friend\'>加好友</button>"  data-html="true" >');
  info_html.push('<img src="' + this.post.avatar + '" class="pull-left img-poster img-big">');
  info_html.push('</a>');
  info_html.push('<a href="' + poster_homepage + '"><span class="poster">' + this.post.name + '</span></a>');
  info_html.push('<a class=\'post-link\' href=\'' + post_url + '\'><time data-datetime="2016年12月18日 12:00" data-timestamp="' + this.post.post_time + '">');
  if(Date.now() - this.post.post_time < 1000 * 60){
    info_html.push('刚刚');
  }else{
    // [TODO] 时间格式化
    info_html.push(this.post.post_time);
  }
  info_html.push('</time></a></div>');
  // 下拉操作框
  info_html.push('<div class="dropdown pull-right dropdown-post-operator">');
  info_html.push('<span class="glyphicon glyphicon-chevron-down dropdown-toggle post-edit-delete" id="operate-posted" data-toggle="dropdown"></span>');
  info_html.push('<ul class="dropdown-menu operate-menu" role="menu" aria-labelledby="operate-posted">');
  info_html.push('<li class="post-edit" role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)">编辑</a></li>');
  info_html.push('<li class="post-delete" role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)">删除</a></li>');
  info_html.push('</ul></div>');
  info_html.push('</div>');

  return info_html.join("");
};

// ----------------------- 回复ui创建者 ---------------

// me {
//   uid:"",
//   name:"",
//   avatar:""  
// }
// comment{
  //   uid:"",
//   name:"",
//   avatar:""

//   cid:"",
//   forComment,
//   content:"",
//   num_of_like:"",
//   num_of_subcomment:"",
// }
function Comment_creator(comment,me){
  this.me = me;
  this.comment = comment;
  this.comment_html = "";
};

Comment_creator.prototype.show_comment_after = function($place){
  $place.after(this.comment_html);
  $place.next('.single-comment').find('.subcomment-input').flexText();
};

Comment_creator.prototype.show_comment_before = function($place){
  $place.before(this.comment_html);
  $place.prev('.single-comment').find('.subcomment-input').flexText();
};

Comment_creator.prototype.create_comment = function(){
  this.comment_html = this.create_comment_html();
};

Comment_creator.prototype.create_comment_html = function(){
  // [TODO] 修改link
  var sender_homepage = '' + this.comment.uid;
  var url_like = '' + this.comment.uid;

  var comment_html = [];
  comment_html.push('<div class="media single-comment" data-comment-id="' + this.comment.comment_id +'">'); // single-comment -- start

  comment_html.push('<a class="media-left" href="' + sender_homepage + '">');
  comment_html.push('<img class="media-object img-mid" src="' + this.comment.avatar + '">');
  comment_html.push(' </a>');

  comment_html.push('<div class="media-body">');  // media-body -- start

  comment_html.push('<h4 class="media-heading pull-left comment-editable-hide"><a class="commenter" href="' + sender_homepage + '">' + this.comment.name + '</a></h4>');
  // 下拉列表
  comment_html.push('<div class="dropdown pull-right comment-editable-hide">');
  comment_html.push('<span class="glyphicon glyphicon-pencil dropdown-toggle comment-edit-delete" id="operate-commented" data-toggle="dropdown"></span>');
  comment_html.push('<ul class="dropdown-menu operate-comment-menu" role="menu" aria-labelledby="operate-commented">');
  comment_html.push('<li class="comment-edit" role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)">编辑</a></li>');
  comment_html.push('<li class="comment-delete" role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)">删除</a></li>');
  comment_html.push('</ul></div>');
// 内容
  comment_html.push('<p class="comment-content clear comment-editable-hide">' + this.comment.content + '</p>');
  comment_html.push('<div class="comment-operation comment-editable-hide">'); // comment-operation -- start
  comment_html.push('<a href="javascript:void(0)">赞</a> ∙ <a class="sub-reply" href="javascript:void(0)">回复</a> · ');
  comment_html.push('<time data-datetime="' + this.comment.date + '" data-timestamp="' + this.comment.timestamp + '" >');
  if( Date.now() - this.comment.date < 1000 * 60){
    comment_html.push('刚刚');
  }else{
    comment_html.push(this.comment.timestamp);
  }
  comment_html.push('</time></div>');  // comment-operation -- end
  // 子评论
  if(this.comment.num_of_comment > 0){
    comment_html.push('<a class="see-more-subcomment" href="#"><img src="./img/reply.png"> ' + this.comment.num_of_subcomment + '条回复</a>');
  }
  comment_html.push('<div class="media-list all-subcoments">'); // all-subcoments -- start
  // 评论编辑器
  comment_html.push('<div class="media subcomment-editor">'); // subcomment-editor -- start
  comment_html.push('<a class="pull-left" href="' + sender_homepage + '">');
  comment_html.push('<img class="media-object img-small" src="' + this.me.avatar + '"></a>');
  comment_html.push('<span class="for-comment" data-for-comment=""></span>');
  comment_html.push('<div class="subcomment-input-div">');
  comment_html.push('<textarea class="subcomment-input" placeholder="写回复..."></textarea>');
  // subcomment-editor all-subcoments media-body single-comment
  comment_html.push('</div></div></div></div></div>');
  //
  return comment_html.join("");
};

// -------------- 次级评论 ---------------
// sender{
//   uid:"",
//   name:"",
//   avatar:""
// }
// comment{
//   cid:"",
//   forComment,
//   content:"",
// }

function Subcomment_creator(comment){
  this.comment = comment;
  this.comment_html = "";
}

Subcomment_creator.prototype.show_subcomment_after = function($place){
  $place.after(this.comment_html);
};

Subcomment_creator.prototype.show_subcomment_before = function($place){
  $place.before(this.comment_html);
};

Subcomment_creator.prototype.create_subcomment = function(){
  this.comment_html = this.create_subcomment_html();
};

Subcomment_creator.prototype.create_subcomment_html = function(){
  var sender_homepage = '' + this.comment.uid;
  var url_like = '' + this.comment.uid;

  var comment_html = [];
  comment_html.push('<div class="media single-subcomment">');
  comment_html.push('<a class="media-left" href="' + sender_homepage + '">');
  comment_html.push('<img class="media-object img-small" src="' + this.comment.avatar + '">');
  comment_html.push('</a>');
  comment_html.push('<div class="media-body data-subcomment-id="' + this.comment.cid + '">');
  comment_html.push('<h4 class="media-heading pull-left"><a class="commenter" href="' + sender_homepage + '">' + this.comment.name + '</a>');
  if(this.comment.towho  && this.comment.towho.length > 0){
    comment_html.push(' <span class="towho">' + this.comment.towho + '</span>');
  }
  comment_html.push('</h4>');
  // 下拉列表
  comment_html.push('<div class="dropdown pull-right">');
  comment_html.push('<span class="glyphicon glyphicon-pencil dropdown-toggle subcomment-edit-delete" id="operate-commented" data-toggle="dropdown"></span>');
  comment_html.push('<ul class="dropdown-menu operate-subcomment-menu" role="menu" aria-labelledby="operate-commented">');
  comment_html.push('<li class="subcomment-edit" role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)">编辑</a></li>');
  comment_html.push('<li class="subcomment-delete" role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)">删除</a></li>');
  comment_html.push('</ul></div>');

  comment_html.push('<p class="subcomment-content clear">' + this.comment.content + '</p>');
  comment_html.push('<div class="subcomment-operation">');
  comment_html.push('<a href="javascript:void(0)">赞</a> · ');
  comment_html.push('<a  class="sub-sub-reply" href="javascript:void(0)">回复</a> · ');
  if(Date.now() > this.comment.timestamp > 1000 * 60){
    comment_html.push('<time>' + this.comment.date + '</time>');
  }else{
    comment_html.push('<time>刚刚</time>');
  }
  comment_html.push('</div>');
  comment_html.push('</div>');
  comment_html.push('</div>');

  return comment_html.join('');
}

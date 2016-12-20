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

    var poster = {
      uid:"",
      name:"",
      avatar:""
    }

    var post = {
      pid:"",
      date:"",
      timestamp:"",
      content:"",
      visibility:"",
      picture:"",
      pic_describe:""
    }
    var $me = $('#me');
    poster.avatar = $me.attr('src');
    poster.name = $me.data('me-name');
		poster.uid = $me.data('me-uid');

// pid，picture 需要从服务器端插入成功后返回
    post.date = "刚刚";
    post.content = post_content;
    // post_content = post_content.replace(/ /g, "&nbsp;");
    // alert(post.content);
	  post.visibility =	$('.whoview').find('.visibility-item').children('span').data('visibility');

    post.picture = './img/doc.jpg';
    post.pic_describe = img_descript;

  // ajax 异步传递给后台 [caren] :修改visibility的find
    var formData = new FormData();
    formData.append('content', post.content);
    formData.append('visibility', post.visibility);
		if(typeof file_img !== 'undefined' ){  //[caren] 加了这个if避免显示空图片
			console.log('有图片');
			formData.append('picture', file_img);
		}else{
			console.log("没有图片，不显示")
		}

    formData.append('pic_describe', post.pic_describe);

    $.ajax({
      url: '/posts',
      type: 'POST',
      cache: false,
      data: formData,
      processData: false,
      contentType: false,
      success:function(res) {

				console.log(res);
				console.log(res.picture);
        post.pid = res.post_id; //[有问题]
        post.picture = res.picture;
        post.timestamp = res.post_time;

        //[TODO] 格式化时间

        console.log(post);


        var post_creator = new Post_creator(poster,post);
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

  // ----------------------- 添加事件 ------------------

// 点击评论，聚焦输入框
  $(document).on('click','.post-comment',function(){
    // 找到输入框的位置
    var singlepost = $(this).closest('.single-post');
    // var inputArea = singlepost.find('.comment-input');
    var editor = singlepost.find('.comment-editor');
    var commentsArea = singlepost.find('.all-comments');
    // 显示评论区域
    commentsArea.css('display','block');
    // 输入框聚焦
    editor.focus();

    // 请求十条评论、总评论数，每条评论的子评论数

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

    var sender = {
      uid:"",
      name:"",
      avatar:""
    };
    var comment = {
      cid:"",
      timestamp:"",
      date:"",
      content:""
    };
    // cid 需要从服务器获得

    var $me = $('#me');
    sender.uid = $me.data('me-uid');
    sender.name = $me.data('me-name');
    sender.avatar = $me.attr('src');

    comment.content = content;

    $singlepost = $(this).closest('.single-post');

    // 提交成功后生成留言图标
    var data = {};
    data.content = comment.content;
    data.post_id = $singlepost.data('post-pid');
		console.log(data);
		var $comment_editor = $(this);

    $.ajax({
      url: '/comment',
      data: data,
      type: 'POST',
      success:function(res) {
        comment.cid = res.comment_id;
        comment.timestamp = res.date;

        //[格式化] comment.date = [格式化]

        // 找到评论的锚点
        $comment_anchor = $comment_editor.closest('.all-comments').find('.comments-anchor');

        // 获取相关数据
        var comment_creator = new Comment_creator(sender,comment);
        comment_creator.create_comment();
        comment_creator.show_comment_after($comment_anchor);

        clearFlex($comment_editor);
        // 输入框内容清空
        // $(this).val("");
      },
      error:function(res) {
        alert('发布失败');
        return event.returnValue=false;
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
  $(document).on('keydown','.subcomment-input',function(event ){ //[添加参数event]
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
    var sender = {
      uid:"",
      name:"",
      avatar:""
    };
    var comment = {
      cid:"",
      date:"",
      content:"",
      towho:""  //回复谁
    };

    var $me = $('#me');
    sender.uid = $me.data('me-uid');
    sender.name = $me.data('me-name');
    sender.avatar = $me.attr('src');

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

        var subcomment_creator = new Subcomment_creator(sender,comment);
        subcomment_creator.create_subcomment();

        subcomment_creator.show_subcomment_before($subcomment_editor);

        // 输入框内容清空
        // $(this).val("");
        clearFlex($subcomment_input);
        // for-comment 清空
        $for_comment.text('');
        $for_comment.attr('data-for-comment',"");
        $for_comment.css('display','none');
        return event.returnValue=false;
      },
      error:function(){
        //错误提示
        alert('服务器错误，请稍后再试！');
        return event.returnValue=false;
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
    $place.find('.comment-editor').flexText();
  }

  // 显示编辑样式
  $(document).on('click','.comment-edit',function(){

    var $singlecomment = $(this).closest('.single-comment');
    // 先关闭其他的编辑框
    // 由于编辑一个，其他comment的编辑区就会关闭，所以只会有一个
    var $update_comment = $singlecomment.closest('.single-post').find('.update-comment');
    // $update_comment
    // 显示原来被编辑的内容，并移除编辑框

      alert($update_comment.length);
    if($update_comment.length >= 1){
      $update_comment.closest('.single-comment').find('.comment-editable-hide').css('display','block');
      $update_comment.closest('.single-comment').find('.media-left').css('display','table-cell');
      $update_comment.remove();
    }else{
      alert("不存在");
    }

    // 获取当前的文本内容
    var content = $singlecomment.find('.comment-content').text();

    // 相关标签隐藏
    alert($singlecomment.find('.comment-editable-hide').length);
    $singlecomment.find('.comment-editable-hide').css('display','none');
    // 插入标签<textarea></textarea>，并添加内容，激活高度自适应方法
    changeCommentToTextarea($singlecomment, content);
    // 填充所获得的文本内容到<pre><span></span><br /></pre>中
    // 剩下的交给下一个监控enter键的函数
  });
  // 监控评论编辑框，用户按下enter键
  $(document).on('keydown','.comment-updater',function(event){//[caren]添加event参数
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

    $.ajax({
      url:'/comment',
      type:'PUT',
      data:{
        comment_id:comment_id,
        content:content
      },
      success:function(res){
        // 成功后将内容填入，移除textarea
        var $singlecomment = $(this).closest('.single-comment');
        var $update_comment = $(this).closest('.update-comment');

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
        alert("删除成功");
        // 移除帖子
        $singlepost.fadeOut();
      },
      error:function(res){
        // 在导航栏下显示错误信息
        alert("[这是导航栏下错误提示]：删除失败");
        alert("删除失败");
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
        alert("删除失败");
        $comment.remove();
      }
    });
  });

   // 删除子评论
  $(document).on('click','.subcomment-delete',function(){
    // [TODO]
    alert('[这是模态框确认]：你确定要删除吗？');

		//[caren] 此处无法获得id
    var $subcomment = $(this).closest('.single-subcomment')
    var subcomment_id = $subcomment.data('subcomment-id');
		console.log(subcomment_id);
    $.ajax({
      url:'/subcomment',
      type:'DELETE',
      data:{
        subcomment_id:subcomment_id
      },
      success:function(res){
        alert("删除成功" + res.message);
        // 移除帖子
        $subcomment.remove();
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
// var poster = {
//   uid:"",
//   name:"",
//   avatar:""
// }

// var post = {
//   pid:"",
//   content:"",
//   visibility:"",
//   picture:"",
//   pic_describe:""
// }
function Post_creator(poster,post){
  this.poster = poster;
  this.post = post;
  this.post_html = "";
}

Post_creator.prototype.create_post = function(){
    this.post_html = this.create_post_html();
}

Post_creator.prototype.show_post = function(){
  $('.all-posts').prepend(this.post_html);
  $("#" + this.post.pid ).find('.comment-editor').flexText();
  $(".lightbox_image").lightbox({
    fixed: true
  });
}

Post_creator.prototype.create_post_html = function(){
  var post_html = [];
  post_html.push('<div class="single-post" id="' + this.post.pid + '" data-post-pid="' + this.post.pid + '" data-poster-uid="' + this.poster.uid + '">');
  post_html.push('<div class="post-main">');
  post_html.push(this.create_post_info(this.poster));
  post_html.push('<p class="post-content">');
  post_html.push(this.post.content);
  if(this.post.havemore){
    post_html.push('...<span class="see-more-link">展开</span>');
  }
  post_html.push('</p>');

  var poster_homepage = '' + this.poster.uid;
  var url_like = '' + this.poster.uid;
  var url_reply = '' + this.poster.uid;
  var post_url = '' + this.post.pid;

  // 图片
  post_html.push('<div class="post-img">');
  post_html.push('<a href="' + this.post.picture + '"');
  post_html.push('class="lightbox_image js-lightbox fs-lightbox-element"');
  post_html.push('data-lightbox-gallery="gallery_fixed" ');
  post_html.push('data-lightbox-options=\'{"fixed":false}\' ');
  post_html.push('data-title="<a class=\'poster\' href=\'' + this.poster_homepage + '\'>' + this.poster.name + '</a> <a class=\'post-link\' href=\'' + post_url + '\'>');
  post_html.push('<time data-datetime=\'' + this.post.date + '\' data-timestamp=\'' + this.post.timestamp + '\' >' + this.post.date + '</time></a><br/>' + this.post.pic_describe + '"');
  post_html.push('title="' + this.post.pic_describe + '">');
  post_html.push('<img src="' + this.post.picture + '">');
  post_html.push('</a></div>');
  // 操作
  post_html.push('<div class="post-operation">');
  post_html.push('<a href="#"><span class="glyphicon glyphicon-thumbs-up"></span> 赞 </a>');
  post_html.push('<a class="post-comment" href="javascript:void(0)">');
  post_html.push('<span class="glyphicon glyphicon-comment"></span> 评论</a>');
  post_html.push('<a href="#"><span class="glyphicon glyphicon-share"></span> 分享</a>');
  post_html.push('<span class="pull-right"><a href="#"></a> <a href=""></a></span>');
  post_html.push('</div></div>');
  // clearfixed
  post_html.push('<div class="clearfix"></div>');
  // 评论
  post_html.push('<div class="all-comments">');
  post_html.push('<div class="comment-input">');
  post_html.push('<img class="pull-left img-mid" src="' + this.poster.avatar + '" />');
  post_html.push('<div class="comment-editor-div"><textarea class="comment-editor" placeholder="写评论..."></textarea></div>');
  post_html.push('</div>');
  post_html.push('<div class="clearfix comments-anchor"></div></div>');
  return post_html.join("");
}

Post_creator.prototype.create_post_info = function(poster, time){

  var post_url = '' + this.post.pid;

  var info_html = [];
  info_html.push('<div class="post-info">');
  info_html.push('<img src="' + poster.avatar + '" class="pull-left img-poster img-big">');
  info_html.push('<a href="#"><span class="poster">' + poster.name + '</span></a>');
  info_html.push('<a class=\'post-link\' href=\'' + post_url + '\'><time>刚刚</time></a>');
  info_html.push('</div>');

  return info_html.join("");
};

// ----------------------- 回复ui创建者 ---------------


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
function Comment_creator(sender,comment){
  this.sender = sender;
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
  var sender_homepage = '' + this.sender.uid;
  var url_like = '' + this.sender.uid;

  var comment_html = [];
  comment_html.push('<div class="media single-comment" data-comment-id="' + this.comment.cid + '">'); // single-comment -- start

  comment_html.push('<a class="media-left" href="' + sender_homepage + '">');
  comment_html.push('<img class="media-object img-mid" src="' + this.sender.avatar + '">');
  comment_html.push(' </a>');

  comment_html.push('<div class="media-body">');  // media-body -- start

  comment_html.push('<h4 class="media-heading"><a class="commenter" href="' + sender_homepage + '">' + this.sender.name + '</a></h4>');
  comment_html.push('<p class="comment-content">' + this.comment.content + '</p>');
  comment_html.push('<div class="comment-operation">'); // comment-operation -- start
  comment_html.push('<a href="' + url_like + ' ">赞</a> ∙ <a class="sub-reply" href="javascript:void(0)">回复</a> · ');
  comment_html.push('<time data-datetime="' + this.comment.date + '" data-timestamp="' + this.comment.timestamp + '" >' + this.comment.date + '</time>');
  comment_html.push('</div>');  // comment-operation -- end
  // 子评论
  comment_html.push('<div class="media-list all-subcoments">'); // all-subcoments -- start
  // 评论编辑器
  comment_html.push('<div class="media subcomment-editor">'); // subcomment-editor -- start
  comment_html.push('<a class="pull-left" href="' + sender_homepage + '">');
  comment_html.push('<img class="media-object img-small" src="' + this.sender.avatar + '"></a>');
  comment_html.push('<span class="for-comment" data-for-comment=""></span>');
  comment_html.push('<div class="subcomment-input-div">');
  comment_html.push('<textarea class="subcomment-input" placeholder="回复..."></textarea>');
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
//  需要继承Comment_creator 再使用

function Subcomment_creator(sender,comment){
  this.sender = sender;
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
  var sender_homepage = '' + this.sender.uid;
  var url_like = '' + this.sender.uid;

  var comment_html = [];
  comment_html.push('<div class="media subcomment">');
  comment_html.push('<a class="media-left" href="' + sender_homepage + '">');
  comment_html.push('<img class="media-object img-small" src="' + this.sender.avatar + '">');
  comment_html.push('</a>');
  comment_html.push('<div class="media-body subcoment">');
  comment_html.push('<h4 class="media-heading"><a class="commenter" href="' + sender_homepage + '">' + this.sender.name + '</a>');
  if(this.comment.towho  && this.comment.towho.length > 0){
    comment_html.push(' <span class="towho">' + this.comment.towho + '</span>');
  }
  comment_html.push('</h4>');
  comment_html.push('<p class="subcomment-content">' + this.comment.content + '</p>');
  comment_html.push('<div class="subcomment-operation">');
  comment_html.push('<a href="' + url_like + '">赞</a> · ');
  comment_html.push('<a  class="sub-sub-reply" href="javascript:void(0)">回复</a> · ');
  comment_html.push('<time>' + this.comment.date + '</time>');
  comment_html.push('</div>');
  comment_html.push('</div>');
  comment_html.push('</div>');

  return comment_html.join('');
}

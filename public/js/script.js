//登陆
var token = undefined;
//登陆，并获取token
$(function(){
	$('#loginBtn').on('click', function(event){
		event.preventDefault();

		var data = {};
		data.email = $('#email').val();
		data.password = $('#password').val();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/login',
      success: function(returanData) {
				window.localStorage.setItem('token',returanData.token);  //登陆以后，浏览器便获得了token,
				token = window.localStorage.getItem('token');
				//利用token设置请求头。
				$.ajaxSetup({
          beforeSend: function (xhr) {
          	xhr.setRequestHeader("token", 'Bearer '+ token);
          },
					headers: {
				       'x-access-token': 'Bearer ' + token,
							 'authorization':  'Bearer ' + token
				     }
        });
				//由于只能使用ajax设置请求头，故这种跳转无法携带token，只能在url最后加token。
					window.location.href = "/?token=" + token;
			},
      error: function(returnData){

				console.log(returnData.msg)
        alert('失败,账号或密码错误');
      }
    });
	})
})
//注册
$(function(){
	$("#registerBtn").on('click', function(event){
		event.preventDefault();
		var data = {};
		data.email = $('#regEmail').val();
		data.password = $('#regPassword').val();
		data.userName = $('#regName').val();
		$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json',
			url: '/register',
			success: function(returnData){
				alert(JSON.parse(returnData).msg);

			},
			err: function(){
				alert('注册失败');
			}
		});
	})
})

// 监督窗口是否最大化，如果最大化，就fixed两边侧边栏，否则设为absolute
$( window ).resize(function() {
  var winWidth;
  if (window.innerWidth){
    winWidth = window.innerWidth;
  }
  else if ((document.body) && (document.body.clientWidth)){
    winWidth = document.body.clientWidth;
  }else if (document.documentElement && document.documentElement.clientWidth){
    winWidth = document.documentElement.clientWidth;
  }

  if(winWidth === window.screen.width){
    $('.sidebar-left-fixed').css('position','fixed');
    $('.sidebar-right-fixed').css('position','fixed');
  }else{
    $('.sidebar-left-fixed').css('position','absolute');
    $('.sidebar-right-fixed').css('position','absolute');
  }
});

// 显示注册表格
$(function(){
	$('.newuser-text').on('click',function(){
		$('.signin-contain').toggle('slow');
	});
});

$(function(){
	// 左边栏鼠移到item上，高亮
	$('.column-item').on('mouseover',function(){
		$(this).addClass('active');
	});
	$('.column-item').on('mouseout',function(){
		$(this).removeClass('active');
	});

// 遮罩
	$('.modal-all').on('click',function(){
    $('.editor').css('zIndex',0);
		$(this).removeClass('in');
	});
	$('.post-input').on('click',function(){
    $('.editor').css('zIndex',311);
		$('.modal-all').addClass('in');
	});

// ************************************************* //

  // 激活图片上传插件
  // $('.imgupload').imgupload();
  // 依赖
  $('.imgupload').imgupload({
    allowedFormats: [ "jpg", "jpeg", "png", "gif" ],
    previewWidth: 120,
    previewHeight: 120,
    maxFileSizeKb: 2048
  });
});

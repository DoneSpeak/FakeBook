$(function(){
	$('.newuser-text').on('click',function(){
		$('.signin-contain').toggle('slow');
	});
});

// 监督输入框，实时修改字体大小
$(function(){
  function changeFontSize(){
    var num=$(this).text().length;
    // alert(num);
    if(num <= 140){
    	$(this).removeClass('small-font');
    	$(this).addClass('middle-font');
    }else{
    	$(this).removeClass('middle-font');
    	$(this).addClass('small-font');
    }
  };
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

  // $('.btn-remove-img').on('click',function(){
  // 	$('.file-tab').css('display','none');
  // });
});


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
				console.log('你存储在localStorage的token是: '+token);

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
// 注册按钮
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
		$(this).removeClass('in');
	});
	$('.post-input').on('click',function(){
		$('.modal-all').addClass('in');
	});

});

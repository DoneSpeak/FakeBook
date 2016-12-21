$(function(){
  $('#searchBtn').on("click", function(event){
    console.log($('#searchKeyWord').val());
  })
  $('#searchKeyWord').on('keydown', function(event){
    if(event.keyCode !== 13){
      return event.returnValue = true;
    }

    searchFriend();
  })

  $(document).on('click','.btn-add-friend', function(event){
    var user_id = $(this).data('userId');
    addAtoBeFriend(user_id);
});


  function searchFriend(){
    var keyword = $('#searchKeyWord').val();
    window.location.href = "/searchUser?token=" + token +"&keyword=" + keyword;
  }

  function addAtoBeFriend(user_id){
    $.ajax({
      type:"GET",
      url:'/friend',
      data:{
        user_id : user_id
      },
      success:function(res){
        alert('添加好友成功');
      },
      error: function(){
        alert('失败，请稍后再试。');
      }
    });
  }
})

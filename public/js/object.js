// 编辑框错误提示模态框
function ModalAlert(id,title,msg,err){
	this.id = id;
	this.title = title;
	this.msg = msg;
	this.err = err;
}

ModalAlert.prototype.create = function(){
	html.push('<div class="modal fade" id="' + this.id + '" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">');
  html.push('<div class="modal-dialog modal-sm">');
  html.push('<div class="modal-content">');
  html.push('<div class="modal-header">');
  html.push('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" class="closer">&times;</span><span class="sr-only">Close</span></button>');
  html.push('<h3 class="modal-title">' + this.title + '</h3>');
  html.push('</div>');
  html.push('<div class="modal-body">');
  html.push(this.msg);
  html.push('</div>');
  html.push('</div>');
  html.push('</div>');
  html.push('</div>');

  var modal = $('"#' + this.id + '"');
  modal.children('.close').children('.closer').on('click',function(){
  	modal.remove();
  });
  
  return html.join("");
};

ModalAlert.prototype.show = function(options){
	$('#editor-alert').modal(options);
};

// ---------- 生成一个 -----------
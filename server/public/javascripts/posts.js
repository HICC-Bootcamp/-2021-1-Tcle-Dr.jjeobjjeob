$('input[type=file]').on('change',function(){
    if(window.FileReader){
      var filename = $(this)[0].files[0].name;
    } else {
      var filename = $(this).val().split('/').pop().split('\\').pop();
    }
    
    $(this).siblings('label').text(filename);
});

$("#update").click(function(event) {  
  const pathname = $(location).attr('pathname').split('/');
  const id = pathname[pathname.length-1];
  
  var formData = new FormData();
  formData.append('id', id);
  formData.append('title', $(".title").val());
  formData.append('text', $(".text").val());
  
  if($(".image")[0].files[0]) {
    // alert($(".image")[0].files[0].name);
    formData.append('image', $(".image")[0].files[0]);
  }
  else {
    formData.append('image', null);
  }

  const redirect = $(location).attr('origin') + '/posts/' + id;  // 게시글 페이지
  $.ajax({
    url: "http://localhost:3000/posts/modify/" + id,
    type: "PUT",
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    data: formData,
    error: function(error) {
      console.error(error);
      $(location).attr('href', redirect);
    }
  });
});
$('input[type=file]').on('change',function(){
    if(window.FileReader){
      var filename = $(this)[0].files[0].name;
    } else {
      var filename = $(this).val().split('/').pop().split('\\').pop();
    }
    
    $(this).siblings('label').text(filename);
});

$("#update").click(function(event) {  
  const id = $("input[type='hidden']").val();
  
  var formData = new FormData();
  formData.append('id', id);
  formData.append('title', $(".title").val());
  formData.append('text', $(".text").val());
  
  if($(".image")[0].files[0]) {
    formData.append('image', $(".image")[0].files[0]);
  }
  else {
    formData.append('image', null);
  }

  const redirect = $(location).attr('origin') + '/posts/' + id;  // 게시글 페이지
  $.ajax({
    url: "http://localhost:3000/posts/" + id,
    type: "PUT",
    processData: false,
    contentType: false,
    enctype: 'multipart/form-data',
    data: formData,
    success: function(data) {
      $(location).attr('href', redirect);
    },
    error: function(error) {
      alert('전송이 실패했습니다.');
    }
  });
});


$("#delete").click(function(event) {  
  const id = $("input[type='hidden']").val();

  const redirect = $(location).attr('origin') + '/posts';  // 게시글 목록 페이지
  $.ajax({
    url: "http://localhost:3000/posts/" + id,
    type: "DELETE",
    success: function(data) {
      $(location).attr('href', redirect);
    },
    error: function(error) {
      alert('전송이 실패했습니다.');
    }
  });
});
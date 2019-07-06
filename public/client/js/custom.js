function init_checkUserOnline() {
  const token = $('main').data('user-token');
  const userId = $('main').data('user-id');


  if (token && userId) {
    const messageSocket = io.connect('/', {
      query: `token=${token}`
    });
  }
}

function sendMessage(formData, callback) {
  $.ajax({
    url: '/messages',
    type: 'POST',
    dataType: 'JSON',
    data: formData,
    contentType: false,
    processData: false,
  }).done(callback);
}

function getMessages() {
  $.ajax({
    url: '/messages',
    type: 'GET',
    dataType: 'json',
  }).done((res) => {
    res.data.forEach((message, index) => {
      const type = message.isBot ? 'user' : 'self';
      $('.chat-logs').append(`
        <div class="chat-msg ${type}" id="chat-msg-${index}">
          <div class="cm-msg-text">${message.content}</div>
        </div>
      `);
    });
  });
}

function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(','); const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

$(function () {
  let INDEX = 0;

  getMessages();

  $('#chat-submit').click(function (e) {
    const formData = new FormData();
    e.preventDefault();
    const imgList=[]
    const image = $('.message-upload-thumbnail')
    if (image.length > 0) {
      $.each(image, (index, item) => {
        imgList.push(item.src);
      });
    }

    if (imgList.length > 0 && imgList.length <= 5) {
      imgList.forEach((el) => {
        const imgId = Math.round(Date.parse(new Date()) + Math.random())
        
        const image = dataURLtoFile(el, `file-${imgId}.jpg`);
        console.log(image);
        
        formData.append('images', image);
       
      });
    }
    


    
    const msg = $('#chat-input').val();
    // if (msg.trim() === '') {
    //   return false;
    // } else {
    //   formData.append('msg', msg)

    // }
    if (msg.trim() !== '') {
      formData.append('msg', msg)
    }
      
    console.log(formData);
    
    // generateMessage(msg, 'self');

    sendMessage(formData, (res) => {
      console.log(res)
      const { data } = res;
      if (data.bot && data.bot.content) {
        generateMessage(data.bot.content, 'user');
      } else {
        generateMessage('Tôi không hiểu được câu này', 'user');
      }
    });
  });




  function generateMessage(msg, type) {
    INDEX++;
    const string = `
      <div class="chat-msg ${type}" id="chat-msg-${INDEX}">
        <div class="cm-msg-text">${msg}</div>
      </div>
    `;
    $('.chat-logs').append(string);
    $(`#cm-msg-${INDEX}`).hide().fadeIn(300);

    if (type === 'self') {
      $('#chat-input').val('');
    }

    $('.chat-logs').stop().animate({ scrollTop: $('.chat-logs')[0].scrollHeight }, 1000);
  }

  $('#chat-circle').click(function () {
    $('#chat-circle').toggle('scale');
    $('.chat-box').toggle('scale');
  });

  $('.chat-box-toggle').click(function () {
    $('#chat-circle').toggle('scale');
    $('.chat-box').toggle('scale');
  })



 
});

$(document).ready(() => {
  let messageImgCount = 0;
  $('#message-upload-image-btn').off('click').on('click', function () {
    let image;
    let cropper;
    const target = 'message-upload-image-input';
    // Click preview-image to trigger click on real input file
    $(`#${target}`).trigger('click');
    const self = $(this);


    // Catch anychange of input file to read data
    $(`#${target}`).off('change').on('change', function () {
      // console.log('CHECK COUNT: ', messageImgCount);
      // if (messageImgCount > 4) {
      // 	$('#comment-upload-img').attr('data-content', "You're just allowed to upload 5 pictures at maximum!");
      // 	$('#comment-upload-img').popover('enable');
      // 	$('#comment-upload-img').popover('show');
      // 	return;
      // }

      if (this.files) {
        // Avoid click on another upload
        if ((this.files.length + messageImgCount) <= 5) {
          // console.log(this.files);
          Object.values(this.files).forEach((el) => {
            const reader = new FileReader();
            // console.log("abc");
            
            if (el) {
              const type = el.type.substr(0, el.type.indexOf('/'));
              const size = el.size;

              // console.log('TOO: ', el);
              // Check whether file is valid in size and type or not
              if (type === 'image' && size <= 5242880 && size > 0) {
                $('#modal-product-upload').modal('show');
                reader.readAsDataURL(el);
                $('#loading-crop-area').removeClass('d-none');
              } else {
                $('#error-exceed-quantity-text').text('Image type is not valid or Image size is over 5MB');
                $('#error-warning-modal-exceed-quantity').modal('show');
              }
            }

            reader.onload = function (e) {
              if (messageImgCount === 0) {
                $('#message-upload-image-list').removeClass('d-none').addClass('d-flex');
              }
              const newImg = new Image();
              newImg.classList.add('message-upload-thumbnail', 'm-0');
              newImg.src = e.target.result;

              const newImgContainer = document.createElement('div');
              newImgContainer.classList.add('position-relative', 'mr-3', 'd-flex', 'message-upload-img-item', 'col-auto');
              newImgContainer.innerHTML = '<i class="fa fa-times cancel-thumbnail-upload-img" aria-hidden="true"></i>';

              newImgContainer.prepend(newImg);
              $('#message-upload-image-list').prepend(newImgContainer);
              messageImgCount++;
            };
          });

          $(`#${target}`).replaceWith($(`#${target}`).val('').clone(true));
        } else {
          $('#error-exceed-quantity-text').text('You can only add maximum 5 pictures at once!');
          $('#error-warning-modal-exceed-quantity').modal('show');
        }
      }
    });

    $('#message-textarea').focus();

    $(document).off('click').on('click', '.cancel-thumbnail-upload-img', function (e) {
      const self = $(this);
      self.parents('.message-upload-img-item').remove();
      messageImgCount--;

      if (messageImgCount === 0) {
        $('#message-upload-image-list').removeClass('d-flex').addClass('d-none');
      }
    });
  });
  
  init_checkUserOnline();
});

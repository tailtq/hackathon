function sendMessage(content, callback) {
  $.ajax({
    url: '/messages',
    type: 'POST',
    dataType: 'json',
    data: { content }
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

$(function () {
  let INDEX = 0;

  getMessages();

  $('#chat-submit').click(function (e) {
    e.preventDefault();
    const msg = $('#chat-input').val();
    if (msg.trim() === '') {
      return false;
    }

    generateMessage(msg, 'self');
    sendMessage(msg, function () {
      generateMessage(msg, 'user');
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
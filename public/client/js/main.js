function messageNotify() {
  const token = $('main').data('user-token');
  const userId = $('main').data('user-id');


  if (token && userId) {
    const messageSocket = io.connect('/', {
      query: `token=${token}`
    });
    // messageSocket.emit('join', userId);
  }

}

$(document).ready(() => {
  messageNotify();
});
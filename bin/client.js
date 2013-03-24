!function() {
  var eio = window.eio;
  delete window.eio;

  var socket = eio('ws://' + window.location.host );
  socket.onopen = evt_socketconnect;
    
  function evt_socketconnect() {
    socket.onmessage = evt_socketmsg;
  }

  function evt_socketmsg( msg ) {
    var data = JSON.parse(msg.data);
    console.log('message', data);
    switch( data.type ) {
      case 'filechange':
        evt_filechange(data);
        break;
      default:
        break;
    }
  }

  function evt_filechange( ev ) {
    var res = document.evaluate('//*[@*=\'\/images\/hiltowned.jpg\']', document, null, XPathResult.ANY_TYPE, null);
    var iter = null;
    while((iter = res.iterateNext()) !== null) {
      console.log(iter)
    }
  }

}()

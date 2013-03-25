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
    if( ev.mimeType === "text/html" ) {
      return processHtml(ev);
    }
    
    relatedElements(ev.file, function( el ){
      switch(el.nodeName) {
        case 'IMG':
          refreshImage(el, ev.file);
          break;
        case 'LINK':
          refreshStylesheet(el);
          break;
        case 'SCRIPT':
          refreshScript(el, ev.file);
        default:
          refreshGeneric(el);
          break;
      }
    });
  }

  function processHtml( data ) {
    var nPath = data.file.replace('index.html', '');

    if( nPath === window.location.pathname 
     || data.file === window.location.pathname ) { 
      window.location.reload();
    }
  }

  function relatedElements( url, cb ) {
    var res = document.evaluate('//*[@*=\'' + url + '\']', document, null, XPathResult.ANY_TYPE, null)
      , iterFunc_r
      , elements = [];

    var iter = null;
    while((iter = res.iterateNext()) !== null) {
      elements.push(iter);
    }
    
    elements.forEach(function( el ) {
      setTimeout(function() {
        console.log(el)
        cb(el); 
      }, 0);
    });
  }

  function refreshGeneric( el ) {
    refreshStylesheet(el)
  }

  function refreshImage( el, src ) {
    var img = new Image();
    img.onload = function() {
      el.src = null;
      el.src = src;
    }
    img.src = el.src
  }

  function refreshStylesheet( el, waitTime ) {
    var sib = el.nextSibling
      , parent = el.parentNode;

    parent.removeChild(el);
    setTimeout(function() {
      parent.insertBefore(el, sib);
    }, waitTime || 0 );
  }

  function refreshScript( el, src ) {
    window.location = window.location.href.toString();
  }

}()

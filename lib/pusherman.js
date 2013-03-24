var fs = require('fs')
  , watch = require('watch')
  , EventEmitter = require('events').EventEmitter
  , socketio
  
  , events = new EventEmitter()

  , Pusherman;

Pusherman = function Pusherman( server )
{
  var Pusherman
    , _server = server || null
    , socketio
    , _paths = {};
    
  Pusherman = function Pusherman()
  {

    if( typeof _server !== null ) {
      socketio = require('socket.io').listen(_server);
    } else {
      socketio = require('socket.io').listen(8888);
    }
  }

  Pusherman.prototype.addPath = function addPath( path, url, filterFn )
  {
    watch.createMonitor(path, {
      filter : filterFn || null
    }, function( monitor ) {
      setupWatcher.call(this, monitor, socketio.sockets, _paths, path);
    }.bind(this));

    _paths[path] = {
      path : path
    , url : url
    };
    console.log(_paths[path])
  }

  Pusherman.prototype.removePath = function removePath( path, url )
  {
    _paths[path].watcher.close();
    delete _paths[path];
  }

  return new Pusherman();
}

module.exports = exports = Pusherman;

function setupWatcher( monitor, sockets, paths, path )
{
  monitor.on("changed", function( file, before, after ) {
    onFileChanges.call(this, file, before, after, sockets, paths, path);
  }.bind(this));
}

function onFileChanges( file, before, after, sockets, paths, path )
{
  var fileUrl = file.replace(paths[path].path, paths[path].url).replace('//', '/');

  console.log('PATH:\t%s', file);
  console.log('URL:\t%s', fileUrl);

  sockets.emit('filechange', {
    file : fileUrl
  , type : 'change'
  });
}

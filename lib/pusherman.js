var fs = require('fs')
  , path = require('path')
  , watch = require('watch')
  , EventEmitter = require('events').EventEmitter
  , mime = require('mime')
  , socketio

  , clientBundle = ""
  
  , events = new EventEmitter()

  , Pusherman;

!function() {
  var engineioPath = require.resolve('engine.io-client').replace('index.js', '');

  fs.readFile(path.join(engineioPath, 'engine.io.js'), { encoding : 'UTF-8' }, function( err, file ) {
    if(err) throw new Error(err);

    clientBundle += file;

    fs.readFile(require.resolve('./client'), { encoding : 'UTF-8' }, function( err, file ) {
      if(err) throw new Error(err);

      clientBundle += file;
    });
  });

}();

Pusherman = function Pusherman( server )
{
  var Pusherman
    , sockets
    , _server = server || null
    , _connections = []
    , _paths = {};
    
  Pusherman = function Pusherman()
  {
    EventEmitter.apply(this);

    if( _server && (typeof _server !== 'boolean') ) {
      sockets = require('engine.io').attach(_server);
    } else {
      sockets = require('engine.io').attach(8888);
    }

    sockets.on('connection', function( socket ) {
      _connections.push(socket);

      socket.on('close', function() {
        var i = _connections.indexOf(socket);
        _connections.splice(i, 1);
      });
    });

    this.on('filechange', function(ev) {
      evt_filechange.call(this, ev, _connections)
    });
  }

  Pusherman.prototype = new EventEmitter();

  Pusherman.prototype.addPath = function addPath( path, url, filterFn )
  {
    watch.createMonitor(path, {
      filter : filterFn || null
    }, function( monitor ) {
      setupWatcher.call(this, monitor, sockets, _paths, path);
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

Pusherman.HTTPHandler = function( req, res, next ) {
  if( req.url !== '/.pusherman.js') {
    return next();
  }

  res.setHeader('Content-Type', 'text/javascript')
  return res.send(clientBundle);
}

module.exports = exports = Pusherman;

function evt_filechange( ev, sockets )
{
  sockets.forEach(function( socket ) {
    sendFileNotification.call(this, socket, ev)
  }.bind(this));
}

function sendFileNotification( socket, info )
{
  socket.send(JSON.stringify(info));
}

function setupWatcher( monitor, sockets, paths, path )
{
  monitor.on("changed", function( file, before, after ) {
    onFileChanges.call(this, file, before, after, sockets, paths, path);
  }.bind(this));
}

function onFileChanges( file, before, after, sockets, paths, path )
{
  var fileUrl = file.replace(paths[path].path, paths[path].url).replace('//', '/');

  this.emit('filechange', {
    file : file.replace(paths[path].path, '')
  , mimeType : mime.lookup(file)
  , type : 'filechange'
  });
}

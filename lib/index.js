var fs = require('fs')
  , EventEmitter = require('events').EventEmitter
  , socketio
  
  , events = new EventEmitter()

  , Pusherman;

console.log('hello pusherman')
Pusherman = function Pusherman( server )
{
  var Pusherman
    , socketio
    , _paths;
    
  Pusherman = function Pusherman( server )
  {
console.log(arguments);
    EventEmitter.call(this);

    _paths = {};
console.log(server);
    if( typeof server !== "undefined" ) {
      //socketio = require('socket.io').listen(server);
    } else {
      //socketio = require('socket.io').listen(8888);
    }

    socketio.sockets.on('connection', handleConnection.bind(this));
  }

  Pusherman.prototype = new EventEmitter();

  Pusherman.prototype.addPath = function addPath( path, url )
  {
    var watcher = fs.watch(path, { persistent : true }, onFileChanges.bind(socketio));

    _paths[path] = { 
      watcher : watcher
    , path : path
    , url : url
    };
  }

  Pusherman.prototype.removePath = function removePath( path, url )
  {
    _paths[path].watcher.close();
    delete _paths[path];
  }
console.log(Pusherman)
  return new Pusherman(server);
}

function onFileChanges( event, filename )
{
  this.sockets.emit('filechange', {
    file : filename
  , type : event
  });
}

function handleConnection( socket )
{
  
}

module.exports = exports = Pusherman;

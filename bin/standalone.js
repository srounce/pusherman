var Pusherman = require('../')
  , path = require('path')
  , fs = require('fs')
  , express = require('express')

  , app
  , server

  , pusher
  , clientBundle = ''
  
  , cwd = process.cwd();

app = express();
server = require('http').createServer(app);
pusher = new Pusherman(server);

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

app.configure(function() {
  app.use(express.compress());
  app.use(app.router);
  app.use(function( req, res, next ) {
    var target = path.join(cwd, req.url);
    var indexPath = path.join(target, 'index.html'); 

    fs.stat(target, function( err, stats ) {
      if( err ) {
        return res.status(404).send();
      }

      if( !stats.isDirectory() ) {
        return next();
      }

      fs.exists(indexPath, function( exists ) {
        if( exists ) {
          res.sendfile(indexPath);
        } else {
          return next();
        }
      });
    });
  });
  app.use(express.directory(cwd, { icons : true }));
  app.use(function( req, res, next ) {
    res.setHeader('Cache-Control', 'public, max-age=0');
    next();
  });
  app.use(express.static(path.join(cwd, '/')));
  app.use(express.errorHandler());
});

pusher.addPath(process.cwd(), '/');

app.get('/.pusherman.js', function( req, res ) {
  res.type('text/javascript').send(clientBundle);
})

server.listen(8080, function() {
  console.info('Listening on port: %d', 8080);
});

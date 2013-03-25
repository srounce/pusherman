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

app.configure(function() {
  app.use(express.compress());
  app.use(Pusherman.HTTPHandler); 
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

server.listen(8080, function() {
  console.info('Listening on port: %d', 8080);
});

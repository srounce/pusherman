var Pusherman = require('../')
  , path = require('path')
  , fs = require('fs')
  , express = require('express')
  , gzippo = require('gzippo')

  , app
  , server
  , pusher
  
  , cwd = process.cwd();

app = express();
server = require('http').createServer(app);
pusher = new Pusherman(server);

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
app.use(gzippo.staticGzip(path.join(cwd, '/')));
app.use(gzippo.compress());
app.use(express.errorHandler());

pusher.addPath(process.cwd(), '/');

app.listen(8080, function() {
  console.info('Listening on port: %s', '//TODO: some port');
});

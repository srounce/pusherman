var Pusherman = require('../')
  , path = require('path')
  , express = require('express')
  , gzippo = require('gzippo')

  , app
  , server
  , pusher
  
  , cwd = process.cwd();

app = express();
server = require('http').createServer(app);
pusher = new Pusherman(server);

app.use(express.directory(cwd, { icons : true }));
app.use(gzippo.staticGzip(path.join(cwd, '/')));
app.use(gzippo.compress());
app.use(express.errorHandler());

pusher.addPath(process.cwd(), '/');

app.listen(8080, function() {
  console.info('Listening on port: %s', '//TODO: some port');
});

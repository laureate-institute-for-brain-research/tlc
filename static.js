// only used to show the static page for development

var StaticServer = require('static-server');
var server = new StaticServer({
    rootPath: '.',            // required, the root of the server file tree
    port: 1337,               // required, the port to listen
    name: 'my-http-server',   // optional, will set "X-Powered-by" HTTP header

    templates: {
      index: 'index.html',      // optional, defaults to 'index.html'
      notFound: '404.html'    // optional, defaults to undefined
    }
  });

  server.start(function () {
    console.log('Server listening to', server.port);
  });
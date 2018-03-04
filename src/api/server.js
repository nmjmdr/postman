const restify = require('restify');

function setup(server) {
  server.pre(restify.pre.sanitizePath());

  server.use(restify.plugins.queryParser({ mapParams: true }));
  server.use(restify.plugins.bodyParser({ mapParams: false }));
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.requestLogger());
  server.on('NotFound', function (req, res, err, cb) {
    return cb();
  });
  server.on('uncaughtException', function(req, res, route, err) {
    console.log(err);
    if (res._header) {
      return res.end();
    } else {
    return res.send(503, 'Service not available');
    }
  });
}

exports.create = () => {
  const server = restify.createServer();
  setup(server);
  return server;
}

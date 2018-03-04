const status = require('./handlers/status');

exports.create = (app) => {
  app.get({ name: "status",
    path: "/status"
  }, [status]);
}

const status = require('./handlers/status');
const mail = require('./handlers/mail');

exports.create = (app) => {
  app.get({ name: "status",
    path: "/status"
  }, [status]);

  app.post({ name: "send-mail",
    path: "/mail"
  }, [mail]);
}

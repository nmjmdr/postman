const log = require('./log');
const processor = require('./mailer');
const config = require('../config');
const server = require('./api/server');
const routes = require('./api/routes');


function setup(configuration) {

  const mailer = processor.create(configuration);

  process.on('uncaughtException', err => {
    const message = err.message || 'unknown error';
    log.error('Uncaught exception, shutting down the worker: ' + message);
    log.error(err);
    mailer.safeExit(1);
  });

  process.on('unhandledRejection', err => {
    log.error('Unhandled rejection', err.stack);
  });

  process.on('SIGINT', () => {
    log.warn('SIGINT (Ctrl-C) received');
    mailer.safeExit(0);
  });

  process.on('SIGTERM', () => {
    log.warn('SIGTERM received');
    mailer.safeExit(0);
  });

  mailer.work();

  const app = server.create({ handleUncaughtExceptions: true });
  routes.create(app);
  app.listen(config.api.port, () => console.log('%s listening at %s', config.api.name, app.url));
}

module.exports = {
  setup: setup
}

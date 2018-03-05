const log = require('./log');
const processor = require('./mailer');
const queueFactory = require('./queue/factory');
const postbox = require('./mailer/postbox');
const fakeProviderFactory = require('./mailer/providers/fake-provider-factory');
const config = require('../config');
const server = require('./api/server');
const routes = require('./api/routes');

const configuration = {
  queue: queueFactory.get(config.queue),
  postbox: postbox.create(fakeProviderFactory('Fake Provider *Lamda', 2),fakeProviderFactory('Fake Provider *Delta', 2)),
  ledger:  require('./ledger/no-store-ledger'),
  schedule: 5000,
  workerId: 'single-worker'
}

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

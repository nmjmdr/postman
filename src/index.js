const log = require('./log');
const mailer = require('./send-mails');

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

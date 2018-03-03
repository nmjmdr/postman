const log = require('./log');
const safeExit = require('./utils/safe-exit');
const taskLedger = require('./tasks-ledger');

safeExit.exit(1, taskLedger.completePending);

process.on('uncaughtException', err => {

  const message = err.message || 'unknown error';
  log.error('Uncaught exception, shutting down the worker: ' + message);
  log.error(err);

  safeExit.exit(1, taskLedger.completePending);
});

process.on('unhandledRejection', err => {
  log.error('UNHANDLED REJECTION', err.stack);
});

process.on('SIGINT', () => {
  log.warn('SIGINT (Ctrl-C) received');
  safeExit.exit(0, taskLedger.completePending);
});

process.on('SIGTERM', () => {
  log.warn('SIGTERM received');
  safeExit.exit(0, taskLedger.completePending);
});

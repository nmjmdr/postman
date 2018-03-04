const worker = require('../worker');
const log = require('../log');
const postbox = require('./postbox');
const ledger = require('../ledger');
const gaurd = require('../gaurd');
const flow = require('./flow');

function create(configuration) {
  const dependencies = {
    queue: configuration.queue,
    gaurd: gaurd,
    ledger: ledger,
    postbox: postbox
  }
  const mailProcessor = flow.create(dependencies);
  const mailWorker = worker.create(mailProcessor.process, gaurd.waitForPending, configuration.schedule);
  return {
    work: mailWorker.work,
    safeExit: mailWorker.safeExit
  }
}

module.exports = {
  create: create
}

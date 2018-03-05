const worker = require('../worker');
const log = require('../log');
const gaurd = require('../gaurd');
const flow = require('./flow');

function create(configuration) {
  const dependencies = {
    queue: configuration.queue,
    postbox: configuration.postbox,
    ledger: configuration.ledger,
    gaurd: gaurd,
    workerId: configuration.workerId
  }
  const mailProcessor = flow.create(dependencies);
  const mailWorker = worker.create(()=>{
    return mailProcessor.process();
  }, gaurd.waitForPending, configuration.schedule);
  return {
    work: mailWorker.work,
    safeExit: mailWorker.safeExit
  }
}

module.exports = {
  create: create
}

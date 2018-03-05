
const queueFactory = require('./queue/factory');
const postbox = require('./mailer/postbox');
const fakeProviderFactory = require('./providers/fake-provider-factory');
const config = require('../config');
const singleProcBench = require('./single-process-api-worker');

const configuration = {
  queue: queueFactory.get(config.queue),
  postbox: postbox.create(fakeProviderFactory('Fake Provider *Lamda', 2),fakeProviderFactory('Fake Provider *Delta', 2)),
  ledger:  require('./ledger/no-store-ledger'),
  schedule: 100,
  workerId: 'single-worker'
}

singleProcBench.setup(configuration);

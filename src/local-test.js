const queueFactory = require('./queue/factory');
const postbox = require('./mailer/postbox');
const config = require('../config');
const singleProcBench = require('./single-process-api-worker');
const sg = require('./providers/sendgrid');
const mg = require('./providers/mailgun');

const sendgrid = sg.create(config.providers.sendgrid.key, config.providers.sendgrid.url);
const mailgun = mg.create(config.providers.mailgun.key, config.providers.mailgun.domain);

console.log(sendgrid, mailgun);

const configuration = {
  queue: queueFactory.get(config.queue),
  postbox: postbox.create({
      fn: sendgrid.send,
      isUnavailableError: sendgrid.isUnavailableError
    },
    {
      fn: mailgun.send,
      isUnavailableError: mailgun.isUnavailableError
    }
  ),
  ledger:  require('./ledger/inmemory-ledger').create(),
  schedule: 5000,
  workerId: 'single-worker'
}

singleProcBench.setup(configuration);

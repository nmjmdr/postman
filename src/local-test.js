const queueFactory = require('./queue/factory');
const postbox = require('./mailer/postbox');
const config = require('../config');
const singleProcBench = require('./single-process-api-worker');
const sg = require('./providers/sendgrid');
const mg = require('./providers/mailgun');

function validationEnvironmentVars() {
  if(!process.env.SENDGRID_KEY || !process.env.MAILGUN_KEY) {
    console.log("Environment variable SENDGRID_KEY and MAILGUN_KEY should be set");
    process.exit(1);
  }
}

validationEnvironmentVars();

const sendgrid = sg.create(process.env.SENDGRID_KEY, config.providers.sendgrid.url);
const mailgun = mg.create(process.env.MAILGUN_KEY, config.providers.mailgun.domain);

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

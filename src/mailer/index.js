const worker = require('../worker');
const queue = require('../queue').create();
const log = require('../log');
const postbox = require('./postbox');
const sentLedger = require('../ledger');
const gaurd = require('../gaurd');

function process() {
  return queue.read()
  .then((message)=>{
    if(!message) {
      log.debug('No messages to process, returning');
      return;
    }
    return processMail(message);
  })
}

function deleteMail(mail) {
  return queue.delete(mail))
  .catch((err)=>{
    log.error('Could not delete message after sending mail');
    return;
  })
}

function processMail(mail) {
  sentLedger.get(mail)
  .then((record))=>{
    if(record) {
      log.info('Mail already sent by a worker; deleting the mail');
      return deleteMail(mail)
    }
    return sendMail(mail);
  }
}

function sendMail(mail) {
  return gaurd.start()
  .then(()=>postbox.send(mail))
  .then((receipt)=>{
    if(!receipt.ok) {
      log.error('Postbox could not send mail');
    }
    return sentLedger.record(mail);
  })
  .then(()=>deleteMail(mail))
  .then(()=>gaurd.end());
}



function create(configuration) {
  const mailWorker = worker.create(process, gaurd.waitForPending, configuration.schedule);
  return {
    work: mailWorker.work,
    safeExit: mailWorker.safeExit
  }
}

module.exports = {
  create: create
}

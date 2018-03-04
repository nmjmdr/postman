const log = require('../log');

function create(dependencies) {
  const queue = dependencies.queue;
  const postbox = dependencies.postbox;
  const ledger = dependencies.ledger;
  const gaurd = dependencies.gaurd;

  function processMail(mail) {
    return ledger.get(mail)
    .then((record)=>{
      if(record) {
        log.info('Mail already sent by a worker; deleting the mail');
        return deleteMail(mail)
      }
      return sendMail(mail);
    });
  }

  function process(assignedTo) {
    return queue.read(assignedTo)
    .then((message)=>{
      if(!message) {
        log.debug('No messages to process, returning');
        return;
      }
      return processMail(message);
    })
  }

  function deleteMail(mail) {
    return queue.delete(mail)
    .catch((err)=>{
      log.error('Could not delete message after sending mail');
      return;
    });
  }

  function sendMail(mail) {
    return gaurd.start()
    .then(()=>postbox.send(mail))
    .then((receipt)=>{
      if(!receipt.ok) {
        log.error('Postbox could not send mail');
      }
      return ledger.record(mail);
    })
    .then(()=>deleteMail(mail))
    .then(()=>gaurd.end());
  }

  return {
    process: process
  };
}

module.exports = {
  create: create
}

const log = require('../log');

function create(dependencies) {
  const queue = dependencies.queue;
  const postbox = dependencies.postbox;
  const ledger = dependencies.ledger;
  const gaurd = dependencies.gaurd;
  const workerId = dependencies.workerId;

  function process() {
    return queue.read(workerId)
    .then((message)=>{
      if(!message) {
        log.info('No messages to process, returning');
        return;
      }
      return processMail(message);
    })
  }

  function processMail(mail) {
    return ledger.isSent(mail.id)
    .then((result)=>{
      if(result) {
        log.info('Mail already sent by a worker; deleting the mail');
        return deleteMail(mail.id);
      }
      return sendMail(mail);
    });
  }

  function deleteMail(mailId) {
    return queue.delete(mailId, workerId)
    .catch((err)=>{
      log.error('Could not delete message after sending mail');
      return;
    });
  }

  function sendMail(mail) {
    return gaurd.start()
    .then(()=> {
      return postbox.send(mail)
    })
    .then((receipt)=>{
      if(!receipt.ok) {
        log.error('Postbox could not send mail');
      }
      return ledger.sent(mail.id);
    })
    .then(()=>{
      return deleteMail(mail.id);
    })
    .then(()=> {
      return gaurd.end()
    });
  }

  return {
    process: process
  };
}

module.exports = {
  create: create
}

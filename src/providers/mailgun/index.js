const toMgMail = require('./mailgun-mail');

function create(apiKey, domain) {
  const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});
  function send(mail) {
    const mgMail = toMgMail(mail);
    return new Promise((resolve, reject)=>{
      mailgun.messages().send(mgMail, (error, body)=>{
        if(error) {
          reject(error);
          return;
        }
        resolve(body);
        return;
      });
    });

  }

  function isUnavailableError(err) {
    console.log(err);
    return true;
  }

  return {
    fn: send,
    isUnavailableError: isUnavailableError
  }
}

module.exports = {
  create: create
}

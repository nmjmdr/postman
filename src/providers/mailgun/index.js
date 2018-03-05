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
        console.log(body)
        resolve(body);
        return;
      });
    });

  }

  function isUnavailableError(error) {
    let isUnavailable = (error.code && (error.code == 'ENOTFOUND' || error.code == 'ETIMEDOUT'));
    isUnavailable = isUnavailable || (error.code && error.code >= 500);
    return isUnavailable;
  }

  return {
    fn: send,
    isUnavailableError: isUnavailableError
  }
}

module.exports = {
  create: create
}

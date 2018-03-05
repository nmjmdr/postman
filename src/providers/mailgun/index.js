const toMgMail = require('./mailgun-mail');

function create(apiKey, domain) {
  const mailgun = require('mailgun-js')({apiKey: apiKey, domain: domain});
  function send(mail) {
    const mgMail = toMgMail(mail);
    return Promise((resolve, reject)=>{
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
  return {
    send: send
  }
}

module.exports = {
  create: create
}
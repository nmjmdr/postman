const request = require('request');
const toSendgridMail = require('./sendgrid-mail');

function create(key, url) {
  const options = {
    method: 'POST',
    url: url,
    headers: {
      'Authorization' : 'Bearer '+key
    },
    json: true
  };

  function send(mail) {
    options.body = toSendgridMail(mail);
    return new Promise((resolve, reject)=>{
      request(options,(err, res, body)=>{
        if(err || (res && res.statusCode !== 202)) {
          const error = {
            err : err,
            code: (res? res.statusCode : null)
          }
          reject(error);
          return;
        }
        resolve(res.statusCode);
      });
    });
  }

  function isUnavailableError(error) {
    let isUnavailable = (error.err && (error.err.code == 'ENOTFOUND') || (error.err && error.err.code == 'ETIMEDOUT'));
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

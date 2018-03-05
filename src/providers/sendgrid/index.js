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
        console.log(res.statusCode)
        if(err || res.statusCode !== 202) {
          const error = {
            err : (err? err : ("Status code: "+res.statusCode+ " Details: "+res.body)),
            code: res.statusCode
          }
          reject(error);
          return;
        }
        resolve(res.body)
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

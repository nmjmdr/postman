const validator = require('./validator');
const queueFactory = require('../../../queue/factory');
const config = require('../../../../config');
const service = require('../../services/mail');

function sendMail(req, res, next) {
  const errors = validator.validate(req.body);
  if(errors && errors.length > 0) {
    res.send(400, errors);
    next(false);
    return;
  }
  const queue = queueFactory.get(config.queue);
  const mailer = service.create(queue);
  mailer.deliver(req.body)
  .then((ids)=>{
    res.send(200, {
      "queued": true,
      "tracking-ids": ids
    });
    next();
  });
}

module.exports = sendMail;

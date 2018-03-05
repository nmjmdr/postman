const validator = require('./validator');


function sendMail(req, res, next) {
  const errors = validator.validate(req.body);
  if(errors && errors.length > 0) {
    res.send(400, errors);
    next(false);
    return;
  }
  // start processing,
  // it should return some unique id with which the errors can be tracked later
  // now it should b queued for processing
  res.send(200, {
    ok: true
  });
  next();
}

module.exports = sendMail;

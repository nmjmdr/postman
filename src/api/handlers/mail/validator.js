const s = require('strummer');

const MaxBatchSize = 10;
const MaxEmailsInTo = 100;

const email = new s.object({
  email: new s.email()
});

const content = new s.object({
  type: new s.enum({values: ['text/plain']}),
  value: s.string()
})

const mailMessage = new s.object({
  to: s.array({min: 1, max: MaxEmailsInTo, of: email}),
  from: email,
  subject: s.string(),
  content: s.array({of: content})
});

const schema = new s.array({min: 1, max: MaxBatchSize, of: mailMessage});

function validate(body) {
  return schema.match(body);
}

module.exports = {
  validate: validate
}

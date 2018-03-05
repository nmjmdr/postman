const mg = require('./providers/mailgun');

const m = mg.create('key-fbbc5ef0448a59f54f34fa237a02d16d', 'sandboxfafaad9efc0c422eb9743d99f116d3d4.mailgun.org');
m.send({
  to: [{ email: 'narasimha.gm@gmail.com'}],
  from: {email: 'postmaster@sandboxfafaad9efc0c422eb9743d99f116d3d4.mailgun.org'},
  subject: 'Hello',
  content: [
    {
      type: 'text/plain',
      value: 'hello'
    }
  ]
})

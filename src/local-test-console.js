const sg = require('./providers/sendgrid');


//[{"to": [{"email": "example@example.com"}]}],"from": {"email": "example@example.com"},"subject": "Hello, World!","content": [{"type": "text/plain", "value": "Heya!"}]}'
const m = sg.create('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', 'https://api.sendgrid.com/v3/mail/send');
m.send({
  to: [{ email: 'narasimha.gm@gmail.com'}],
  from: {email: 'narasimha.gm@gmail.com'},
  subject: 'Hello',
  content: [
    {
      type: 'text/plain',
      value: 'hello'
    }
  ]
})
.then((r)=>{
  console.log(r);
})
.catch((err)=>{
  console.log("Error: ", err);
})

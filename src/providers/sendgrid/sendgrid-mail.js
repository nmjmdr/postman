/*
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"personalizations": [{"to": [{"email": "example@example.com"}]}],"from": {"email": "example@example.com"},"subject": "Hello, World!","content": [{"type": "text/plain", "value": "Heya!"}]}'

*/
module.exports = (mail) => {
  let sgMail = {
    "personalizations": []
  };

  sgMail.personalizations.push({ "to": mail.to });
  if(mail.cc) {
    sgMail.personalizations.push({ "cc": mail.cc });
  }
  if(mail.bcc) {
    sgMail.personalizations.push({ "bcc": mail.bcc });
  }
  sgMail.from = mail.from;
  sgMail.subject = mail.subject;
  sgMail.content = mail.content;
  return sgMail;
}

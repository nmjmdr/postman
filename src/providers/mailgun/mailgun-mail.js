const FormData = require('form-data');

module.exports = (mail) => {
  let mgMail = {};
  mgMail.from = mail.from.email;
  addRecipient('to', mail, mgMail);
  addRecipient('cc', mail, mgMail);
  addRecipient('bcc', mail, mgMail);
  if(mail.subject) {
    mgMail.subject = mail.subject;
  }
  if(mail.content && mail.content.length > 0 && mail.content[0].value) {
    mgMail.text =  mail.content[0].value;
  }
  return mgMail
}

function addRecipient(field, mail, mgMail){
  if(mail[field]) {
    mgMail[field] = mail[field].reduce((acc, item)=>{
      acc = acc + ", " + item.email;
      return acc;
    },'');
  }
}

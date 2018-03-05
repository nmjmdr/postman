const idgenLib = require('../../../utils/id-gen');
const apiConfig = require('../../../../config').api;
const datacentreId = apiConfig? apiConfig['data-centre-id'] : null;
const apiInstanceId = apiConfig? apiConfig['api-instance-id'] : null;
const idgen = idgenLib.create(datacentreId, apiInstanceId);

function create(queue) {
  function deliver(mails) {
    // stamp each mail with an id, and queue it
    if(!mails) {
      return;
    }
    const accumaltor = mails.reduce((acc, mail)=>{
      mail.id = idgen.nextId();
      acc.promises.push(queue.add(mail));
      acc.ids.push(mail.id);
      return acc;
    },{ promises:[], ids: [] });

    return Promise.all(accumaltor.promises)
    .then(()=>{
      return accumaltor.ids;
    });
  }
  return {
    deliver: deliver
  }
}

module.exports = {
  create: create
}

const worker = require('./worker');

const mailWorker = worker.create(()=>{
  console.log('Send emails');
  return Promise.resolve(true);
},()=>{
  console.log("Safe exit");
  return Promise.resolve(true);
},1000);

module.exports = {
  safeExit: mailWorker.safeExit,
  work: mailWorker.work
}

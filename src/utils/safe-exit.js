const log = require('../log');

function exit(exitCode, completePending) {
  completePending()
  .then((ok)=>{
    log.info('Safe exit - OK, completed pending tasks ', ok);
  })
  .catch((err)=>{
    log.warn('Safe exit - Not OK, could not completed pending tasks ', err);
  })
}
module.exports = {
  exit: exit
}

const log = require('../log');

function schedule(taskFunction, every) {
  taskFunction()
  .then((ok)=>{
    log.debug('Task executed successfuly ', ok);
  })
  .catch((err)=>{
    log.debug('Task execution failed ', err);
  })
  .then(()=>{
    log.debug('Scheduling again');
    setTimeout(()=>{
      schedule(taskFunction, every);
    }, every);
  })
}

function exit(cleanUpFunction, code) {
  cleanUpFunction()
  .then((ok)=>{
    log.debug('Safe exit - OK; Completed pending tasks ',ok);
    process.exit(exitCode);
  })
  .catch((err)=>{
    log.debug('Safe exit - Not OK; Could not completed pending tasks ',err);
    process.exit(code);
  })
}

function create(taskFunction, cleanUpFunction, every) {
  return {
    work: ()=>{
      schedule(taskFunction, every)
    },
    safeExit: (exitCode)=>{
      exit(cleanUpFunction, exitCode);
    }
  }
}

module.exports = {
  create: create
}

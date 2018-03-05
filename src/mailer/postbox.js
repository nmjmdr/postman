const log = require('../log');
const circuitbreaker = require('../circuit-breaker');
const MaxCallsToSecondaryBeforeProbing = 10;

function toss() {
  return Math.random() >= 0.5;
}

function probePolicy(stats) {
  // try randomly after "n" calls to secondary
  if(stats.callsToSecondary > MaxCallsToSecondaryBeforeProbing) {
    return toss();
  }
  return false;
}

function create(primary, secondary) {
  console.log(primary);
  console.log(secondary);
  const invokeFn = circuitbreaker.create(primary.fn, secondary.fn, probePolicy,(err, fnUsed)=>{
    const isUnavailableError = (fnUsed === primary.fn)? primary.isUnavailableError : secondary.isUnavailableError;
    return isUnavailableError(err);
  });

  const send = (mail) =>{
    return invokeFn([mail])
    .then((result)=>{
      const usedFunction = (result.invoked === primary.fn)? "primary" : "secondary";
      log.debug("Used "+usedFunction+" to send mail");
      return {
        ok: true
      }
    })
    .catch((err)=>{
      log.error("Could not send mail using both primary or secondary");
      log.error(err);
      return {
        ok: false
      }
    });
  }
  return {
    send: send
  }
}

module.exports = {
  create: create
}

// This must use cicruit breaker

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
  const invokeFn = cicruitbreaker.create(primary, secondary, probePolicy);
  const send = (mail) =>{
    invokeFn([mail])
    .then((result)=>{
      // result can indicate wheter it used primary or secondary
      // return result.ok = true
    })
    .catch((err)=>{
      // both primary and secondary invocation failed or the input is malformed
      // in any case we cannot do much, return result.ok = false
    })
  }
  return {
    send: send
  }
}

module.exports = {
  create: create
}

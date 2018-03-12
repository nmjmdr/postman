function safeInvoke(fn1, fn2, args, onErrorTryOther) {
  return wrappedInvoke(fn1,args)
  .catch((err)=>{
    if(onErrorTryOther(err, fn1)) {
      return wrappedInvoke(fn2, args);
    } else {
      throw err;
    }
  })
}

function wrappedInvoke(fn, args) {
  return fn(...args)
  .then((r)=>{
    return {
      invoked: fn,
      result: r
    }
  })
}


function create(primary, secondary, shouldProbe, onErrorTryOther) {
  let fn1 = primary;
  let fn2 = secondary;
  let stats = {
    callsToSecondary: 0,
    ticksSincePrimaryFailed: null,
  }

  function setStats(invocation) {
    if(invocation.invoked === secondary) {
      stats.callsToSecondary++;
      stats.ticksSincePrimaryFailed = stats.ticksSincePrimaryFailed? stats.ticksSincePrimaryFailed : new Date().getTime()
    } else {
      stats.callsToSecondary = 0;
      stats.ticksSincePrimaryFailed = null;
    }
  }

  function invoke(args){
    if(fn1 === secondary && shouldProbe(stats)) {
      fn1 = primary;
      fn2 = secondary;
    }
    return safeInvoke(fn1, fn2, args, onErrorTryOther)
    .then((invocation)=>{
      setStats(invocation)
      fn1 = (invocation.invoked === primary)? primary : secondary;
      fn2 = (invocation.invoked === secondary)? primary : secondary;
      return invocation;
    })
  }
  return invoke;
}

module.exports = {
  create: create
}

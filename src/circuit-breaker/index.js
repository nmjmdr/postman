function safeInvoke(fn1, fn2, args) {
  return invokeFunction(fn1, args)
  .catch((err)=>{
    return invokeFunction(fn2, args)
  });
}

function invokeFunction(fn, args) {
  return fn(...args)
  .then((result)=>{
    return {
      invoked: fn,
      result: result
    }
  })
}

function shouldFlip(usedFn, fn, alternate) {
  return (usedFn === fn)? fn : alternate;
}

function create(primary, secondary, probePolicy) {
  let fn = primary;
  let stats = {
    callsToSecondary: 0
  };

  function computeStats(usedFn) {
    if(usedFn === secondary) {
      stats.callsToSecondary++;
    } else {
      stats.callsToSecondary = 0;
    }
  }


  function invoke(args) {
    let alternate = (fn === primary)? secondary : primary;
    if(fn === secondary && probePolicy(stats)) {
      fn = primary;
      alternate = secondary;
    }

    return safeInvoke(fn, alternate, args)
    .then((result)=>{
      computeStats(result.invoked, fn);
      fn = shouldFlip(result.invoked, fn, alternate);
      return result;
    })
  }

  return invoke
}

module.exports = {
  create: create
}

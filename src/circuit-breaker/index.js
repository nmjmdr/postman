function safeInvoke(fn1, fn2, args, isUnavailableError) {
  return invokeFunction(fn1, args)
  .catch((err)=>{
    if(isUnavailableError(err, fn1)) {
      return invokeFunction(fn2, args)
    } else {
      throw err;
    }
  });
}

function invokeFunction(fn, args) {
  console.log("Here: ",fn)
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

function create(primary, secondary, probePolicy, isUnavailableError) {
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

    return safeInvoke(fn, alternate, args, isUnavailableError)
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

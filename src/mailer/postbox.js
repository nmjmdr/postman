// This must use cicruit breaker

module.exports = {
  send: ()=>{
    return Promise.resolve(true);
  }
}


function create() {
  return {
    sent: ()=>{
      return Promise.resolve(true);
    },
    isSent: ()=>{
      return Promise.resolve(false);
    }
  }
}

module.exports = {
  create: create
}

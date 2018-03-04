module.exports = {
  record: (r)=>{
    return Promise.resolve(true);
  },
  get: ()=>{
    return Promise.resolve(false);
  }
}

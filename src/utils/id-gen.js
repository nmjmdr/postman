const FlakeId = require('flake-idgen');
const intformat = require('biguint-format');
const MaxInstanceIdFlake = 31;
const MinInstanceIdFlake = 1;


function getRandom() {
  return Math.floor(Math.random() * (MaxInstanceIdFlake - MinInstanceIdFlake + 1) + MinInstanceIdFlake);
}

function create(datacentreId, workerId) {
  if(!workerId) {
    workerId = getRandom()
  }
  if(!datacentreId) {
    datacentreId = getRandom()
  }
  const flake = new FlakeId({ datacentre: datacentreId, worker: workerId});
  return {
    nextId: ()=>{
      return intformat(flake.next(), 'hex', { prefix: '0x' });
    }
  }
}


module.exports = {
  create: create
}

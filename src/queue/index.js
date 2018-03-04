const config = require('../config');

function create() {
  const queue = config['queue-type']? require[config['queue-type']] : null
  if(!queue) {
    throw new Error('Invalid config, queue-type not defined or implementation not present');
  }
  return queue;
}

module.exports = {
  create: create
}

const bunyan = require('bunyan');
const name = require('../package').name;

const log = bunyan.createLogger({name: name});

module.exports = log

module.exports = {
  get: (config)=>{
    const queueLib = require('./'+config.type);
    if(!queueLib) {
      throw new Error("Unknown queue type - factort cannot create it");
    }
    const queue = queueLib.create({
      name: config.name,
      visiblityTimeout: config.visiblityTimeout
    });
    return queue;
  }
}

// naive - in memory queue, only use to test
let map = {};

function setVisiblityTimer(item, timeout) {
  setTimeout(()=>{
    item.assignedTo = null
  },timeout);
}

function curry(queue) {
  function read(assignedTo) {
    if(!assignedTo) {
      throw new Error("assignedTo cannot be empty")
    }

    const item = queue.buffer.find((item)=>{
      return !item.assignedTo
    });

    if(!item) {
      return Promise.resolve(null);
    }

    item.assignedTo = assignedTo;
    setVisiblityTimer(item, queue.visiblityTimeout);
    return Promise.resolve(item);
  }

  function deleteItem(itemId, workerId) {
    if(queue.buffer.length === 0) {
      return Promise.resolve(true);
    }
    const lenBefore = queue.buffer.length;
    queue.buffer = queue.buffer.filter((item)=>{
       return !(item.id === itemId && item.assignedTo === workerId);
    });
    const lenAfter = queue.buffer.length;
    return Promise.resolve(lenAfter < lenBefore);
  }

  function add(item) {
    queue.buffer.push(item);
    return Promise.resolve(true);
  }

  return {
    read: read,
    delete: deleteItem,
    add: add
  }
}

function create(configuration) {
  if(!map[configuration.name]) {
    map[configuration.name] = {
      visiblityTimeout: configuration.visiblityTimeout,
      buffer: []
    };
  }
  return curry(map[configuration.name]);
}

function get(queueName) {
  if(!map[queueName]) {
    return null;
  }
  return curry(map[queueName]);
}

function clearAll() {
  map = {};
}

module.exports = {
  create: create,
  get: get,
  clearAll: clearAll
}

let map = {}

function setVisiblityTimer(item, timeout) {
  setTimeout(()=>{
    item.assignedTo = null
  },timeout);
}

function curry(queue) {
  function read(assignedTo) {
    if(queue.buffer.length === 0) {
      return null;
    }
    const item = queue.buffer.find((item)=>{
      return !item.assignedTo
    });
    item.assignedTo = assignedTo;
    setVisiblityTimer(item, queue.visiblityTimeout);
    //return Promise.resolve(item);
    return item;
  }

  function deleteItem(item) {
    if(queue.buffer.length === 0) {
      return Promise.resolve(true);
    }
    queue.buffer = queue.buffer.filter((item)=>{
      return item.id == itemToDelete.id
    });
    //return Promise.resolve(true);
    return true;
  }

  function add(item) {
    queue.buffer.push(item);
    //return Promise.resolve(true);
    return true;
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

module.exports = {
  create: create,
  get: get
}

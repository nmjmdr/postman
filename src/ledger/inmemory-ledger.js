
function create() {
  let map = {};
  function sent(id) {
    map[id] = true;
    return Promise.resolve(true);
  }

  function isSent(id) {
    return Promise.resolve(!!map[id]);
  }

  return {
    sent: sent,
    isSent: isSent
  }
}



module.exports = {
  create: create
}

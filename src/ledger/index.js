function record() {
  return Promise.resolve(true);
}

function get() {
  return Promise.resolve(false);
}

module.exports = {
  record: record,
  get: get
}

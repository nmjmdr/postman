function sent() {
  return Promise.resolve(true);
}

function isSent() {
  return Promise.resolve(false);
}

module.exports = {
  sent: sent,
  isSent: isSent
}

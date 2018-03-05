module.exports = (req, res, next) => {
    res.send(200,{
      "status": "ok"
    });
    return next();
}

const {
  decodeToken
} = require('../helpers');

module.exports = (req, res, next) => {
  if (req.headers.hasOwnProperty('token')) {
    try {
      const decode = decodeToken(req.headers.token);
      req.decode = decode;
      next();
    } catch(e) {
      next({
        code: 401
      })
    }
  } else {
    next({
      code: 401
    })
  }
}
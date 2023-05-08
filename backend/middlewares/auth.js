const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadTokenError = require('../errors/BadTokenError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new BadTokenError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key');
  } catch (err) {
    return next(new BadTokenError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

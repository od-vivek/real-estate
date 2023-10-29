const { createError } = require('./error');
const jwt = require('jsonwebtoken');

module.exports = async function verifyToken(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return next(createError(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(403, 'Forbidden'));
    }
    // Send user information to the next middleware.
    req.user = user; // This is typically the user ID.
    next();
  });
};

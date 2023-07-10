const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'secret-key', (err, decoded) => {
      const userId = decoded.userId;

      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        }

        return res.status(401).json({ message: 'Invalid token' });
      }

      User.findById(userId).then(user => {
        if (!user) {
          return res.formatError(404, 'User not found');
        }

        req.userId = user._id;
        next();
      }).catch(() => res.formatError(500, 'Internal server error'));
    });
};

module.exports = verifyToken;
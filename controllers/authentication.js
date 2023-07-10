const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.formatError(404, 'User no exist');
      }

      bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return res.formatError(401, 'Wrong password');
          }

          const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '1d' });

          res.cookie('jwt', token, {
            domain: '.microfrontend.com',
            path: '/',
          });

          res.formatResponse(200, 'Success', {token});
        })
        .catch(() => res.formatError(500, 'Internal server error'));
    })
    .catch(() => res.formatError(500, 'Internal server error'));
};

const registration = (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.formatError(409, 'A user with this email already exists');
      }

      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          const newUser = new User({ firstName, lastName, email, password: hashedPassword });

          newUser.save()
            .then((savedUser) => {
              const token = jwt.sign({ userId: savedUser.id }, 'secret-key', { expiresIn: '1d' });

              res.formatResponse(200, 'Success', { token });
            })
            .catch(() => res.formatError(500, 'Internal server error'));
        })
        .catch(() => res.formatError(500, 'Internal server error'));
    })
    .catch(() => res.formatError(500, 'Internal server error'));
};

module.exports = { login, registration };
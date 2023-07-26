const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.formatError(400, 'Email and Password are reuqired', {
      email: 'Email is required.',
      password: 'Password is required.'
    });
  }

  if (!email) {
    return res.formatError(400, 'Email is reuqired', {
      email: 'Email is required.',
    });
  }

  if (!password) {
    return res.formatError(400, 'Password is reuqired', {
      password: 'Password is required.'
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.formatError(404, 'User no exist', {
          email: 'User no exist.'
        });
      }

      bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return res.formatError(401, 'Wrong password', {
              password: 'Wrong password.'
            });
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
  const validationResult = new User({ firstName, lastName, email, password }).validateSync();

  if (validationResult) {
    return res.formatError(400, 'There were some problems with your input', validationResult);
  }

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
            .catch((error) => res.formatError(500, 'Internal server error', error));
        })
        .catch((error) => res.formatError(500, 'Internal server error', error));
    })
    .catch(() => res.formatError(500, 'Internal server error'));
};

module.exports = { login, registration };
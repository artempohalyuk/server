// authRoutes.js
const express = require('express');
const router = express.Router();
const { login, registration } = require('../controllers/authentication');

router.post('/login', login);
router.post('/registration', registration);

module.exports = router;
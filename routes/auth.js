const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Auth = require('../resources/auth');

router.post('/authenticate', [ body('email').isEmail(), body('password').isLength({ min:8 }) ], Auth.post);

module.exports = router;
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const resets = require('../resources/resets');
const reset = require('../resources/reset');

router.post('/resets', [ body('email').isEmail() ], resets.post);

router.get('/resets/:token', reset.get);

// technically this should be router.delete but i cant send data along with delete routes
// so put it is
router.put('/resets/:token', [ body('password').isLength({ min:8 }) ] , reset.delete);

module.exports = router;
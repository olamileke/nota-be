const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticate = require('../middlewares/authenticate').authenticate;
const notes = require('../resources/notes');

router.post('/notes', authenticate, [ body('content').isLength({ min:17 }) ], notes.post);

module.exports = router;
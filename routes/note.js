const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticate = require('../middlewares/authenticate').authenticate;
const note = require('../resources/note');

router.put('/notes/:id', authenticate, [ body('content').isLength({ min:17 }) ], note.put);

router.delete('/notes/:id', authenticate, note.delete)

module.exports = router;

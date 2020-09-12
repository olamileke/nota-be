const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate').authenticate;
const versions = require('../resources/versions');

router.get('/notes/:note_id/versions', authenticate, versions.get);

module.exports = router;
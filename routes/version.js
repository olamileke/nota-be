const express =  require('express');
const router = express.Router();
const version = require('../resources/version');
const authenticate = require('../middlewares/authenticate').authenticate;

router.delete('/notes/:note_id/versions/:hash', authenticate, version.delete);

module.exports = router;
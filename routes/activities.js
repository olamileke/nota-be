const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate').authenticate;
const activities = require('../resources/activities');

router.get('/activities', authenticate, activities.get);

module.exports = router;
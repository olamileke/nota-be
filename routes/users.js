const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const users = require('../resources/users');

router.post('/users', [ body('name').custom((value, { req }) => {
    const [fname, lname] = value.split(' ');

    if(!fname || !lname) {
        return Promise.reject('enter a valid first and last name');
    }

    return true;
}), body('email').isEmail(), body('password').isLength({ min:8 }) ], users.post);

module.exports = router;
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const users = require('../resources/users');
const authenticate = require('../middlewares/authenticate').authenticate;
const multer = require('../middlewares/multer');

router.post('/users', [ body('name').custom((value, { req }) => {
    const [fname, lname] = value.split(' ');

    if(!fname || !lname) {
        return Promise.reject('enter a valid first and last name');
    }

    return true;
}), body('email').isEmail(), body('password').isLength({ min:8 }) ], users.post);


router.put('/users', authenticate, multer, [ body('image').custom((value, {req}) => {
    if(!req.file) {
        return Promise.reject('image is required');
    }

    return true;
}) ], users.put)


router.patch('/users/:token', users.patch);

module.exports = router;
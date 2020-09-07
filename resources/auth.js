const User = require('../models/user');
const secretKey = require('../utils/config').secretKey;
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function post(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.errors = errors;
        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        let user = await User.findByEmail(email);
        if(!user) {
            const error = new Error('user does not exist');
            error.statusCode = 404;
            throw error;
        }

        const passwordCorrect = await bcrypt.compare(password, user.password);
        if(!passwordCorrect) {
            const error = new Error('user does not exist');
            error.statusCode = 404;
            throw error;   
        }

        const token = jwt.sign({ id:user._id }, secretKey, { expiresIn:'14d' } );
        delete user._id;
        delete user.password;
        delete user.created_at;

        res.status(200).json({
            data:{
                user:user,
                token:token
            }
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }

        next(error);
    }
}

exports.post = post;
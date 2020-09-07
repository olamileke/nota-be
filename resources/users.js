const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const s3FileLink = require('../utils/config').s3FileLink;

async function post(req, res, next)  {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422;
        error.errors = errors;
        throw(error);
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const avatar = s3FileLink + 'users/unknown.png';

    try {
        let user = await User.checkCreated(email);
        if(user) {
            const error = new Error('user with email exists already');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user = new User(name, email, avatar, hashedPassword, Date.now());
        await user.save();
        const newUser = { name, email, avatar };

        res.status(201).json({
            data:{
                user:newUser
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
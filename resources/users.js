const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const file = require('../utils/file');
const s3FileLink = require('../utils/config').s3FileLink;

async function post(req, res, next)  {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('validation failed')
        error.statusCode = 422;
        error.errors = errors;
        return next(error);
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const avatar = s3FileLink + 'users/unknown.png';

    try {
        let user = await User.findByEmail(email);
        if(user) {
            const error = new Error('user with email exists already');
            error.statusCode = 400;
            throw(error);
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
        return next(error);
    }
}

async function put(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('image is required');
        error.statusCode = 422;
        return next(error);
    }

    const awsUniqueKey = req.user.avatar.split(s3FileLink)[1];
    
    if(awsUniqueKey != 'users/unknown.png') {
        file.delete(awsUniqueKey, next);
    }

    await file.upload(req, next, 'users', avatar => {

        User.updateAvatar(req.user._id, avatar)
        .then(() => {
            const user = { name:req.user.name, email:req.user.email, avatar };
            res.status(200).json({
                data:{
                    user:user
                }
            })
        })
        .catch(error => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            return next(error);
        })
    
    });
}

exports.post = post;
exports.put = put;
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');
const User = require('../models/user');
const file = require('../utils/file');
const mail = require('../utils/mail');
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
        crypto.randomBytes(32, async (error, buffer) => {
            if(error) {
                throw(error);
            }

            const token = buffer.toString('hex');
            user = new User(name, email, avatar, hashedPassword, token, Date.now());
            await user.save();
            const newUser = { name, email, avatar };
            const mailPath = path.join('templates', 'confirm.html');
            const data = {to:email, subject:'Confirm your Email', name:name.split(' ')[1], token, mailPath};
            await mail(data);

            res.status(201).json({
                data:{
                    user:newUser
                }
            })
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

async function patch(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.errors = errors;
        return next(error);
    }

    const token = req.body.token;

    try {
        
        const user = await User.findByToken(token);
        if(!user) {
           const error = new Error(`user with activation token ${token} does not exist`);
           error.statusCode = 404;
           throw(error);
        }

        await User.updateToken(token);
        res.status(200).json({
            message:'user confirmed successfully'
        });
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }

}

exports.post = post;
exports.put = put;
exports.patch = patch;
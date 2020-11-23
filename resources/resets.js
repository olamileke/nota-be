const User = require('../models/user');
const Reset = require('../models/reset');
const { validationResult } = require('express-validator');
const mail = require('../utils/mail');
const path = require('path');
const crypto = require('crypto');

async function post(req, res, next) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('valid email is required');
        error.statusCode = 422;
        return next(error);
    }

    const email = req.body.email;

    try {
        const user = await User.findByEmail(email);
        if(!user) {
            const error = new Error(`user with ${email} email does not exist`);
            error.statusCode = 404;
            throw(error);
        }

        crypto.randomBytes(32, async (error, buffer) => {
            if(error) {
                throw(error);
            }
            const token = buffer.toString('hex');

            const expiry = Date.now() + (30 * 60 * 1000);
            await Reset.delete(user._id);
            const reset = new Reset(user._id, token, expiry, Date.now());
            await reset.save();
            const dt = new Date(expiry);
            const time = `${dt.getHours()}:${dt.getMinutes()}`;
            const mailPath = path.join(path.dirname(process.mainModule.filename), 'templates', 'change-password.html');
            const data = {to:user.email, name:user.name, subject:'Change your Nota password', expiry:time, token, mailPath };
            await mail(data);
            res.status(200).json({
                message:'password reset mail sent successfully'
            });
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
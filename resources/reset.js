const Reset = require('../models/reset');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

async function get(req, res, next) {

    const token = req.params.token;

    try {
        const reset = await Reset.findByToken(token);

        if(!reset) {
            const error = new Error('invalid reset token');
            error.statusCode = 400;
            throw(error);
        }

        if(Date.now() > reset.expiry) {
            const error = new Error('expired reset token');
            error.statusCode = 400;
            throw(error);
        }

        const data = {token, expiry:reset.expiry, created_at:reset.created_at};

        res.status(200).json({
            data:{
                reset:data
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

async function deleteReset(req, res, next) {
    const token = req.params.token;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('password must be at least 8 characters in length');
        error.statusCode = 422;
        return next(error);
    }

    const password = req.body.password;

    try {
        const reset = await Reset.findByToken(token);

        if(!reset) {
            const error = new Error('invalid reset token');
            error.statusCode = 400;
            throw(error);
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.updatePassword(reset.user_id, hashedPassword);
        await Reset.delete(reset.user_id);
        res.status(200).json({
            message:'user password changed successfully'
        });
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.get = get;
exports.delete = deleteReset;
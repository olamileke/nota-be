const jwt = require('jsonwebtoken');
const secretKey = require('../utils/config').secretKey;
const User = require('../models/user');

async function authenticate(req, res, next) {
    const authHeader = req.get('Authorization');

    if(!authHeader) {
        const error = new Error('authentication failed');
        error.statusCode = 401;
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    if(!token) {
        const error = new Error('authentication failed');
        error.statusCode = 401;
        return next(error);
    }

    console.log(authHeader);
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, secretKey);
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }

    if(!decodedToken) {
        const error = new Error('authentication failed');
        error.statusCode = 401;
        return next(error);
    }

    const user = await User.findByID(decodedToken.id)

    if(!user) {
        const error = new Error('authentication failed');
        error.statusCode = 401;
        return next(error);
    }

    req.user = user;
    next();
}

exports.authenticate = authenticate
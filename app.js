const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./utils/database').connectToDatabase;
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); 

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accepts, Authorization');
    next();
})

app.use('/api/v1', userRoutes);
app.use('/api/v1/', authRoutes);

// custom error handler
app.use((error, req, res, next) => {
    console.log(error);
    const statusCode = error.statusCode || 500;
    const message = error.message;
    const errors = error.errors;

    if(errors) {
        return res.status(statusCode).json({
            message:message,
            errors:errors
        })
    }

    return res.status(statusCode).json({
        message:message
    })
})

connectToDatabase(() => {
    app.listen(4000);
})


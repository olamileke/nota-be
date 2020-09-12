const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./utils/database').connectToDatabase;
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); 
const notesRoutes = require('./routes/notes');
const activityRoutes = require('./routes/activities');
const noteRoutes = require('./routes/note');
const versionsRoutes = require('./routes/versions');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accepts, Authorization');
    next();
})

app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', notesRoutes);
app.use('/api/v1', activityRoutes);
app.use('/api/v1', noteRoutes);
app.use('/api/v1', versionsRoutes);

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


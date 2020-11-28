const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectToDatabase = require('./utils/database').connectToDatabase;
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); 
const notesRoutes = require('./routes/notes');
const activityRoutes = require('./routes/activities');
const noteRoutes = require('./routes/note');
const versionsRoutes = require('./routes/versions');
const versionRoutes = require('./routes/version');
const resetsRoutes = require('./routes/resets');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accepts, Authorization');
    next();
})

app.use(express.static(path.join(__dirname, 'templates')));

app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', notesRoutes);
app.use('/api/v1', activityRoutes);
app.use('/api/v1', noteRoutes);
app.use('/api/v1', versionsRoutes);
app.use('/api/v1', versionRoutes);
app.use('/api/v1', resetsRoutes);

// 404 route handler
app.use('/', (req, res, next) => {
    res.status(404).json({
        message:'endpoint does not exist'
    });
})

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


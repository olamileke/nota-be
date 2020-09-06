const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./utils/database').connectToDatabase;

const app = express();
app.use(bodyParser.json())

connectToDatabase(() => {
    app.listen(4000);
})


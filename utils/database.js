const mongoClient = require('mongodb').MongoClient;
const mongodbConnectionString = require('./config').mongodbConnectionString;

let db;

const connectToDatabase = cb => {
    mongoClient.connect(mongodbConnectionString)
    .then(client => {
        db = client.db();
        cb();
    })
}

const getDB = () => {
    if(db) {
        return db;
    }
}

exports.connectToDatabase = connectToDatabase;
exports.getDB = getDB;
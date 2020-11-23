const { ObjectID } = require('mongodb').ObjectID;
const getDB = require('../utils/database').getDB;

class Reset {
    
    constructor(user_id, token, expiry, created_at) {
        this.user_id = user_id;
        this.token = token;
        this.expiry = expiry;
        this.created_at = created_at;
    }

    save() {
        const db = getDB();
        return db.collection('password_resets').insertOne(this);
    }

    static findByToken(token) {
        const db = getDB();
        return db.collection('password_resets').findOne({ token:token });
    }

    static delete(user_id) {
        const db = getDB();
        return db.collection('password_resets').deleteMany({ user_id:ObjectID(user_id) });
    }
}

module.exports = Reset;
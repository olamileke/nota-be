const getDB = require('../utils/database').getDB;
const ObjectID = require('mongodb').ObjectID;

class User {

    constructor(name, email, avatar, password, created_at) {
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.password = password;
        this.created_at = created_at;
    }

    static findByID(id) {
        const db = getDB();
        return db.collection('users').findOne({ _id:new ObjectID(id) });
    }

    static findByEmail(email) {
        const db = getDB();
        return db.collection('users').findOne({ email:email });
    }

    static updateAvatar(id, avatar) {
        const db = getDB();
        return db.collection('users').updateOne({ _id:new ObjectID(id) }, { $set:{ avatar:avatar } });
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this);
    }
}

module.exports = User;
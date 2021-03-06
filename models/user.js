const getDB = require('../utils/database').getDB;
const ObjectID = require('mongodb').ObjectID;

class User {

    constructor(name, email, avatar, password, activation_token, created_at) {
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.password = password;
        this.activation_token = activation_token;
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

    static findByToken(token) {
        const db = getDB();
        return db.collection('users').findOne({ activation_token:token });
    }

    static updateToken(token) {
        const db = getDB();
        return db.collection('users').updateOne({ activation_token:token }, { $set:{ activation_token:null } });
    }

    static updateAvatar(id, avatar) {
        const db = getDB();
        return db.collection('users').updateOne({ _id:new ObjectID(id) }, { $set:{ avatar:avatar } });
    }

    static updatePassword(id, password) {
        const db = getDB();
        return db.collection('users').updateOne({ _id:new ObjectID(id) }, { $set:{ password:password } });
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this);
    }
}

module.exports = User;
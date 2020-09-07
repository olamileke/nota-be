const getDB = require('../utils/database').getDB;

class User {

    constructor(name, email, avatar, password, created_at) {
        this.name = name;
        this.email = email;
        this.avatar = avatar;
        this.password = password;
        this.created_at = created_at;
    }

    static findByEmail(email) {
        const db = getDB();
        return db.collection('users').findOne({ email:email });
    }

    save() {
        const db = getDB();
        return db.collection('users').insertOne(this);
    }
}

module.exports = User;
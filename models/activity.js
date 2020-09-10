const { ObjectID } = require('mongodb');

const getDB = require('../utils/database').getDB;

class Activity {

    constructor(user_id, note_id, note_title, version, action, created_at) {
        this.user_id = user_id;
        this.note_id = note_id;
        this.note_title = note_title;
        version ? this.version = version : '';
        this.action = action;
        this.created_at = created_at;
    }

    save() {
        const db = getDB();
        return db.collection('activities').insertOne(this);
    }

    static count(user_id) {
        const db = getDB();
        return db.collection('activities').find({ user_id:new ObjectID(user_id) }).count();
    }

    static get(user_id, skip, limit) {
        const db = getDB();
        return db.collection('activities').find({ user_id:new ObjectID(user_id) }).sort({ created_at:-1 }).skip(skip).limit(limit).toArray();
    }   
}

module.exports = Activity;
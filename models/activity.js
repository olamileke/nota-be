const getDB = require('../utils/database').getDB;

class Activity {

    constructor(user_id, note_id, note_title, action, created_at) {
        this.user_id = user_id;
        this.note_id = note_id;
        this.note_tite = note_title;
        this.action = action;
        this.created_at = created_at;
    }

    save() {
        const db = getDB();
        return db.collection('activities').insertOne(this);
    }
}

module.exports = Activity;
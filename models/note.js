const { get } = require('../routes/notes');
const { ObjectID } = require('mongodb');

const getDB = require('../utils/database').getDB;
const hash = require('../utils/hash').hash;

class Note {

    constructor(user_id, title, content, created_at, updated_at) {
        this.user_id = user_id;
        this.title = title;
        this.created_at = created_at;
        this.updated_at = updated_at;
        const version = { hash:hash(), content:content, created_at:created_at };
        this.versions = [ version ];        
    }

    save() {
        const db = getDB();
        return db.collection('notes').insertOne(this);
    }

    static getMultiple(user_id, page, limit) {
        const db = getDB();

        if(limit) {
            return db.collection('notes').find({ user_id:new ObjectID(user_id) }).sort({ created_at:-1 }).limit(limit).toArray();
        }
    }
}

module.exports = Note;
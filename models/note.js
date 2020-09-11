const { get } = require('../routes/notes');
const { ObjectID } = require('mongodb');
const getDB = require('../utils/database').getDB;
const hash = require('../utils/hash').hash;
const perPage = require('../utils/config').perPage;

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

    static count(user_id) {
        const db = getDB();
        return db.collection('notes').find({ user_id:new ObjectID(user_id) }).count();
    }

    static getMultiple(user_id, page, limit) {
        const db = getDB();

        if(page) {
            const skip = (page - 1) * perPage;
            const limit = page * perPage;
            return db.collection('notes').find({ user_id:new ObjectID(user_id) }).sort({ created_at:-1 }).skip(skip).limit(limit).toArray();
        }

        return db.collection('notes').find({ user_id:new ObjectID(user_id) }).sort({ created_at:-1 }).limit(limit).toArray();
    }
}

module.exports = Note;
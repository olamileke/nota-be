const Note = require('../models/note');
const { validationResult } = require('express-validator');
const getTitle = require('../utils/title');
const hash = require('../utils/hash');
const Activity = require('../models/activity');
const formatNote = require('../utils/formatnotes');

async function put(req, res, next) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.errors = errors;
        return next(error);
    }

    const id = req.params.id;
    const content = req.body.content;

    try {
        const note = await Note.findByID(id);
        if(!note) {
            const error = new Error('note does not exist');
            error.statusCode = 404;
            throw error;
        }

        if(req.user._id.toString() != note.user_id.toString()) {
            const error = new Error('you are not authorized');
            error.statusCode = 403;
            throw error;
        }

        if(content == note.versions[note.versions.length - 1].content) {
            return res.status(200).json({
                data:{
                    note:note
                }
            })
        }

        const version = { hash:hash(), content, created_at:Date.now() };
        note.versions.push(version);
        const title = getTitle(content);
        let updateTitle = false;
        
        if(note.title != title) {
            note.title = title;
            updateTitle = true;
        }
        const now = await Note.update(note); 

        if(updateTitle) {
            await Activity.updateTitle(note._id, title);
        }

        const activity = new Activity(req.user._id, note._id, note.title, version.hash, 2, now);
        await activity.save();

        res.status(200).json({
            data:{
                note:formatNote([note])[0]
            }
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 422;
        }
        return next(error);
    }
}

async function deleteNote(req, res, next) {

    const id = req.params.id;

    try {
        const note = await Note.findByID(id);
        if(!note) {
            const error = new Error('note does not exist');
            error.statusCode = 404;
            return next(error);
        }

        if(req.user._id.toString() != note.user_id.toString()) {
            const error = new Error('you are not authorized');
            error.statusCode = 403;
            throw error;
        }

        await Note.delete(id);
        await Activity.delete(id);

        res.status(204).json({
            message:'note deleted successfully'
        });
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
}

exports.put = put;
exports.delete = deleteNote;
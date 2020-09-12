const Note = require('../models/note');
const Activity = require('../models/activity');
const { validationResult } = require('express-validator');
const getTitle = require('../utils/title');
const formatNotes = require('../utils/formatnotes');
const perPage = require('../utils/config').perPage;

async function post(req, res, next) {   
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.errors = errors;
        return next(error);
    }

    const content = req.body.content;
    const title = getTitle(content);
        
    let note;

    try {
        note = new Note(req.user._id, title, content, Date.now(), Date.now());
        const { ops } = await note.save();
        const activity = new Activity(req.user._id, ops[0]._id, title, null, 1, Date.now());
        await activity.save();
    }
    catch(error) {
        if(!error) {
            error.statusCode = 500;
        }
        return next(error);
    }
  
    note = { user_id:req.user_id, title, content, created_at:Date.now(), updated_at:Date.now() };
    res.status(201).json({
        data:{
            note:note
        }
    })
}

async function get(req, res, next) {

    let limit;
    req.query.limit ? limit = Number(req.query.limit) : '';
    
    if(limit) {
        try {
            const notes = await Note.getLastUpdated(req.user._id, limit);
            return res.status(200).json({ 
                data:{
                    notes:formatNotes(notes)
                }
            })            
        }
        catch(error) {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
            return next(error);
        }
    }

    let page;
    req.query.page ? page = Number(req.query.page) : page = 1;
    const skip = (page - 1) * perPage;
    limit = page * perPage;

    try {
        const notes = await Note.getMultiple(req.user._id, skip, limit);
        const totalNotes = await Note.count(req.user._id);

        res.status(200).json({
            data:{
                notes:formatNotes(notes),
                totalNotes:totalNotes
            }
        })
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
}

exports.post = post;
exports.get = get;


const Note = require('../models/note');
const Activity = require('../models/activity');
const { validationResult } = require('express-validator');

async function post(req, res, next) {   
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('validation failed');
        error.statusCode = 422;
        error.errors = errors;
        return next(error);
    }

    const content = req.body.content;
    let [ wordOne, wordTwo, wordThree, ...rest ] = content.split(' ');

    const splits = wordOne.split('>');
    wordOne = splits[splits.length - 1];
    let title;

    if(!wordTwo || !wordThree) {
        title = wordOne.slice(0, 3);
    } else {
        title = wordOne.charAt(0) + wordTwo.charAt(0) + wordThree.charAt(0);
        title = title.toLowerCase();
    }

    let note;

    try {
        note = new Note(req.user._id, title, content, Date.now(), Date.now());
        const { ops } = await note.save();
        const activity = new Activity(req.user._id, ops[0]._id, title, 1, Date.now());
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

exports.post = post;


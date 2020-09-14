const Note = require('../models/note');
const Activity = require('../models/activity');

async function deleteVersion(req, res, next) {
    
    const note_id = req.params.note_id;
    const hash = req.params.hash;

    try {
        const note = await Note.findByID(note_id);
        if(!note) {
            const error = new Error('note does not exist');
            error.statusCode = 404;
            return next(error);
        }

        if(req.user._id.toString() != note.user_id.toString()) {
            const error = new Error('you are not authorized');
            error.statusCode = 403;
            throw(error);
        }

        if(note.versions.length == 1) {
            const error = new Error('you are not authorized');
            error.statusCode = 403;
            throw(error);
        } 

        const versions = [...note.versions];
        const idx = versions.findIndex(version => version.hash == hash);

        if(!idx) {
            const error = new Error('note version does not exist');
            error.statusCode = 404;
            throw(error);
        }

        versions.splice(idx, 1);
        await Note.updateVersions(note_id, versions);
        await Activity.deleteVersion(note_id, hash);
        note.versions = versions;

        res.status(204).json({
            message:'version deleted successfully'
        });
    }
    catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }   
}

exports.delete = deleteVersion;
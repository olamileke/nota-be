const Note = require('../models/note');
const perPage = require('../utils/config').perPage;

async function get(req, res, next) {

    let page;
    req.query.page ? page = Number(req.query.page) : page = 1;

    const note_id = req.params.note_id;
    const skip = (page - 1) * perPage;
    const limit = page * perPage;

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
            return next(error);
        }

        let versions = [...note.versions].reverse().slice(skip, limit);
        versions = versions.map(version => {
            version.note = note.title;
            return version;
        })

        res.status(200).json({
            data:{
                versions:versions,
                totalVersions:note.versions.length
            }
        })
    }
    catch(error) {
        if(!error.statusCode) [
            error.statusCode = 500
        ]
        return next(error);
    }
}

exports.get = get;
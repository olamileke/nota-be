const multerPackage = require('multer');

const fileFilter = (req, file, cb) => {
    const mimeType = file.mimetype.toLowerCase();
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

    if(!allowedTypes.includes(mimeType)) {
        return cb(null, false);
    }

    return cb(null, true);
}

const storage = multerPackage.memoryStorage();
const multer = multerPackage({ storage:storage, fileFilter:fileFilter }).single('image');

module.exports = multer;
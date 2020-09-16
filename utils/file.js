const config = require('./config');
const AWS = require('aws-sdk');

const s3Bucket = new AWS.S3({
    accessKeyId:config.awsAccessKeyId,
    secretAccessKey:config.awsSecretKey,
    region:config.awsRegion
})

const upload = (req, next, folder, cb) => {
    const file = req.file;
    const fileName = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;

    const fileParams = {
        Bucket:config.awsBucketName, 
        Key:folder + '/' + fileName,
        Body:file.buffer,
        ContentType:file.mimetype,
        ACL:"public-read"
    };

    s3Bucket.upload(fileParams, (error, data) => {
        if(error) {
            error.statusCode ? error.statusCode = 500 : error.statusCode = error.statusCode;
            return next(error);
        }

        const imageUrl = config.s3FileLink + folder + '/' + fileName;
        cb(imageUrl);
    })
}

const deleteAvatar = (uniqueKey, next) => {
    const fileParams = {
        Bucket:config.awsBucketName,
        Key:uniqueKey
    };

    s3Bucket.deleteObject(fileParams, (error, data) => {
       if(error) {
            error.statusCode ? error.statusCode = 500 : error.statusCode = error.statusCode;
            return next(error);
       };
    })
}

exports.upload = upload;
exports.delete = deleteAvatar;
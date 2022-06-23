const multer = require('multer');

/******************************************************
to create a file_storage_engine for => "Profile Photo"
*******************************************************/
const fileStorageForProfilePhoto = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/uploads/profilePhoto');
    },
    filename: (req, file, cb) => {
        cb(null, /*new Date().toISOString().replace(/:/g, '-') + '-' +*/ file.originalname)
    }
})
/******************************************************
to create a file_storage_engine for => "Decscription by media"
*******************************************************/
const fileStorageForDescriptionMedia = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'media/uploads/descriptionByMedia');
    },
    filename: (req, file, cb) => {
        cb(null,/* new Date().toISOString().replace(/:/g, '-') + '-' + */file.originalname)
    }
})

/******************************************************
to create a file_filter "filestorage"
*******************************************************/
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.name === 'image/jpeg') {
        callback(null, true)
    } else {
        callback(null, true)
    }
}

module.exports = {
    fileStorageForDescriptionMedia,
    fileStorageForProfilePhoto,
    fileFilter
}
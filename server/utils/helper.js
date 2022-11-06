const multer = require("multer");
const uniqueFilename = require('unique-filename');

const successResponse = (code, message, data) => {
    return { success : true ,code, message, data};
}

const errorResponse = (code, message, errors) => {
    return { success : false ,code, message, errors};
}

const diskStorage = (path, extension) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path);
    },
    filename: (req, file, cb) => {
        const fileName = uniqueFilename('','',new Date().toISOString())+extension;
        req.body.filename = fileName;
        cb(null, fileName);
    }
})


const upload = (fileName, path, extension) => multer({ storage: diskStorage(path, extension)}).single(fileName);

module.exports = { diskStorage, successResponse, errorResponse, upload };
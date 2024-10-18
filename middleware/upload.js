import multer from 'multer';

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/') // Directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '_' + file.originalname); // Unique filename
    }
});

const upload = multer({
    storage: multerStorage,
});

export default upload;

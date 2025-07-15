const multer = require('multer')

module.exports = multer ({
    Storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
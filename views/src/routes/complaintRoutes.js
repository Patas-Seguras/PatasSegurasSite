const express = require('express');
const router = express.Router();
const submitComplaint  = require('../controllers/complaintController.js');
const upload = require('../config/multer.js');

<<<<<<< HEAD
router.post('/complaint-page', upload.single('photos'), submitComplaint);
=======
router.post('/complaints', upload.array('photos'), submitComplaint);
>>>>>>> 3e115ac3225d33e2cc26d784b63984804a6b101c

module.exports = router;
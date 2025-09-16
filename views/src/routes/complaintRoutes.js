const express = require('express');
const router = express.Router();
const submitComplaint  = require('../controllers/complaintController.js');
const upload = require('../config/multer.js');

router.post('/complaint-page', upload.single('photos'), submitComplaint);

module.exports = router;
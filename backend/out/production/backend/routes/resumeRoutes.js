const express = require('express');
const router = express.Router();
const {
    uploadResume,
    getResume,
    deleteResume
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { uploadResume: resumeUpload } = require('../config/multer');

// Sab routes protected hain
router.use(protect);

router.get('/', getResume);
router.post('/', resumeUpload, uploadResume);
router.delete('/', deleteResume);

module.exports = router;
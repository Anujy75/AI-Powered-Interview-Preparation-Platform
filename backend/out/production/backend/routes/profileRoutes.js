const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    uploadAvatar,
    deleteAvatar
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { uploadAvatar: avatarUpload } = require('../config/multer');

// Sab routes protected hain
router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/avatar', avatarUpload, uploadAvatar);
router.delete('/avatar', deleteAvatar);

module.exports = router;
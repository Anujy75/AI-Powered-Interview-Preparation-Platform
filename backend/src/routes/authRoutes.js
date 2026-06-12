const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    getMe,
    refreshToken
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/refresh-token', refreshToken);  // ← New
router.get('/me', protect, getMe);

module.exports = router;
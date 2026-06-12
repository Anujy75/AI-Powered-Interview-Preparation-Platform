const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Avatar Storage ────────────────────────────────────────────
const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/avatars';
        // Folder nahi hai to banao
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Unique filename: userId + timestamp + extension
        const uniqueName = `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// ─── Resume Storage ────────────────────────────────────────────
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/resumes';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `resume-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// ─── File Filter — Images only ─────────────────────────────────
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'), false);
    }
};

// ─── File Filter — PDF only ────────────────────────────────────
const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// ─── Export ────────────────────────────────────────────────────
exports.uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: imageFilter
}).single('avatar');

exports.uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: pdfFilter
}).single('resume');
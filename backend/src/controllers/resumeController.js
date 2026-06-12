const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// ─── T25: Upload Resume ────────────────────────────────────────
// POST /api/resume
exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file'
            });
        }

        // Purana resume delete karo
        const user = await User.findById(req.user.id);
        if (user.resume) {
            const oldPath = path.join(__dirname, '../../uploads/resumes', path.basename(user.resume));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Naya resume save karo
        const resumeUrl = `/uploads/resumes/${req.file.filename}`;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { resume: resumeUrl },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            resume: resumeUrl,
            user: updatedUser
        });
    } catch (err) {
        next(err);
    }
};

// ─── T26: Get Resume ───────────────────────────────────────────
// GET /api/resume
exports.getResume = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.resume) {
            return res.status(404).json({
                success: false,
                message: 'No resume found'
            });
        }

        res.status(200).json({
            success: true,
            resume: user.resume
        });
    } catch (err) {
        next(err);
    }
};

// ─── T27: Delete Resume ────────────────────────────────────────
// DELETE /api/resume
exports.deleteResume = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.resume) {
            return res.status(400).json({
                success: false,
                message: 'No resume to delete'
            });
        }

        // File delete karo
        const resumePath = path.join(__dirname, '../../uploads/resumes', path.basename(user.resume));
        if (fs.existsSync(resumePath)) {
            fs.unlinkSync(resumePath);
        }

        // DB update karo
        await User.findByIdAndUpdate(req.user.id, { resume: null });

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
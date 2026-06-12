const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// ─── T21: Get Profile ──────────────────────────────────────────
// GET /api/profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
};

// ─── T22: Update Profile ───────────────────────────────────────
// PUT /api/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedFields = ['name', 'email'];
        const updates = {};

        allowedFields.forEach(field => {
            if (req.body[field]) updates[field] = req.body[field];
        });

        // Email change ho rahi hai to duplicate check karo
        if (updates.email && updates.email !== req.user.email) {
            const emailExists = await User.findOne({ email: updates.email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            updates.isEmailVerified = false; // naya email verify karna hoga
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (err) {
        next(err);
    }
};

// ─── T23: Avatar Upload ────────────────────────────────────────
// POST /api/profile/avatar
exports.uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        // Purana avatar delete karo
        const user = await User.findById(req.user.id);
        if (user.avatar) {
            const oldPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        // Naya avatar save karo
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: avatarUrl },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Avatar uploaded successfully',
            avatar: avatarUrl,
            user: updatedUser
        });
    } catch (err) {
        next(err);
    }
};

// ─── T24: Delete Avatar ────────────────────────────────────────
// DELETE /api/profile/avatar
exports.deleteAvatar = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user.avatar) {
            return res.status(400).json({
                success: false,
                message: 'No avatar to delete'
            });
        }

        // File delete karo
        const avatarPath = path.join(__dirname, '../../uploads/avatars', path.basename(user.avatar));
        if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
        }

        // DB update karo
        await User.findByIdAndUpdate(req.user.id, { avatar: null });

        res.status(200).json({
            success: true,
            message: 'Avatar deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
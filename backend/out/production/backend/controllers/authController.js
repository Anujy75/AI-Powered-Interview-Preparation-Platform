const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendWelcomeEmail, sendVerifyEmail } = require('../services/emailService');

// ─── Generate Access Token ─────────────────────────────────
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// ─── Generate Refresh Token ────────────────────────────────
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    });
};

// ─── Send Token Response ───────────────────────────────────
const sendTokenResponse = async (user, statusCode, res) => {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Refresh token DB mein save karo
    await User.findByIdAndUpdate(user._id, { refreshToken });

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    // Refresh token cookie mein bhejo
    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    res
        .status(statusCode)
        .cookie('token', accessToken, cookieOptions)
        .json({
            success: true,
            token: accessToken,
            refreshToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified
            }
        });
};

// ─── Register ──────────────────────────────────────────────
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        const user = await User.create({ name, email, password });

        const verifyToken = crypto.randomBytes(32).toString('hex');
        user.emailVerifyToken = crypto.createHash('sha256').update(verifyToken).digest('hex');
        user.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        try {
            await sendWelcomeEmail(user);
            await sendVerifyEmail(user, verifyToken);
        } catch (emailErr) {
            console.log('⚠️ Email send failed:', emailErr.message);
        }

        await sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// ─── Login ─────────────────────────────────────────────────
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        await sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// ─── Logout ────────────────────────────────────────────────
exports.logout = async (req, res, next) => {
    try {
        // Refresh token DB se clear karo
        if (req.cookies.refreshToken) {
            await User.findOneAndUpdate(
                { refreshToken: req.cookies.refreshToken },
                { refreshToken: null }
            );
        }

        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true
        });

        res.cookie('refreshToken', 'none', {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        next(err);
    }
};

// ─── Refresh Token ─────────────────────────────────────────
exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token provided'
            });
        }

        // Token verify karo
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        // DB mein check karo
        const user = await User.findOne({
            _id: decoded.id,
            refreshToken: token
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Naya access token do
        const newAccessToken = generateAccessToken(user._id);

        res.cookie('token', newAccessToken, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            token: newAccessToken
        });
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token invalid or expired'
        });
    }
};

// ─── Get Me ────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
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
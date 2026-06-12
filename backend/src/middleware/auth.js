const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── T12: Protect Route Middleware ─────────────────────────────
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Token header se lo
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Ya cookie se lo
        else if (req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, please login'
            });
        }

        // Token verify karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // User DB mein hai?
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        req.user = user; // user ko request mein attach karo
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token invalid or expired'
        });
    }
};

// ─── Role based access ─────────────────────────────────────────
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
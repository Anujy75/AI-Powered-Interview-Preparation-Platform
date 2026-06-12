const nodemailer = require('nodemailer');

// ─── Transporter create karo ───────────────────────────────────
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ─── Transporter verify karo ───────────────────────────────────
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email service error:', error.message);
    } else {
        console.log('✅ Email service ready');
    }
});

// ─── Welcome Email ─────────────────────────────────────────────
exports.sendWelcomeEmail = async (user) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: '🎯 Welcome to AI Interview Platform!',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1; text-align: center;">🎯 AI Interview Platform</h1>
        <h2 style="color: #fff;">Welcome, ${user.name}! 👋</h2>
        <p style="color: #94a3b8;">Your account has been successfully created. You can now:</p>
        <ul style="color: #94a3b8;">
          <li>Take MCQ interviews</li>
          <li>Practice with AI mock interviews</li>
          <li>Track your progress</li>
          <li>Get job recommendations</li>
        </ul>
        <a href="${process.env.CLIENT_URL}/dashboard" 
           style="display: inline-block; background: #6366f1; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">
          Go to Dashboard
        </a>
        <p style="color: #475569; font-size: 12px; margin-top: 30px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `
    };
    await transporter.sendMail(mailOptions);
};

// ─── Email Verify ──────────────────────────────────────────────
exports.sendVerifyEmail = async (user, verifyToken) => {
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: '✅ Verify your email — AI Interview Platform',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1; text-align: center;">🎯 AI Interview Platform</h1>
        <h2>Verify your email</h2>
        <p style="color: #94a3b8;">Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${verifyUrl}" 
           style="display: inline-block; background: #10b981; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">
          Verify Email
        </a>
        <p style="color: #475569; font-size: 12px; margin-top: 20px;">
          Or copy this link: ${verifyUrl}
        </p>
      </div>
    `
    };
    await transporter.sendMail(mailOptions);
};

// ─── Password Reset Email ──────────────────────────────────────
exports.sendPasswordResetEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: '🔐 Password Reset — AI Interview Platform',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #fff; padding: 40px; border-radius: 12px;">
        <h1 style="color: #6366f1; text-align: center;">🎯 AI Interview Platform</h1>
        <h2>Reset your password</h2>
        <p style="color: #94a3b8;">You requested a password reset. Click below to set a new password. This link expires in 10 minutes.</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #ef4444; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px;">
          Reset Password
        </a>
        <p style="color: #475569; font-size: 12px; margin-top: 20px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `
    };
    await transporter.sendMail(mailOptions);
};
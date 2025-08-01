const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { status } = require('../config/common');

exports.register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validate name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ status: status.error, message: 'Name is required and must be at least 2 characters long' });
    }

    // Validate email
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ status: status.error, message: 'A valid email is required' });
    }

    // Validate password
    if (!password || typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ status: status.error, message: 'Password is required and must be at least 6 characters long' });
    }

    // Validate confirmPassword
    if (!confirmPassword || typeof confirmPassword !== 'string' || confirmPassword !== password) {
        return res.status(400).json({ status: status.error, message: 'Confirm password must match password' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        });
        res.status(201).json({
            status: status.success,
            message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ status: status.error, message: 'Email already exists' });
        }
        res.status(500).json({ status: status.error, message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ status: status.error, message: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ status: status.error, message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: status.error, message: 'Invalid email or password' });
        }

        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            status: status.success,
            message: 'Login successful',
            access_token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ status: status.error, message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ status: status.error, message: 'A valid email is required' });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ status: status.error, message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpires,
                updatedAt: new Date()
            },
        });

        console.log(`Reset token: ${resetToken} for email: ${email}. Send this to user.`);

        res.status(200).json({
            status: status.success,
            message: 'Password reset token generated. Please check your email.',
        });
    } catch (error) {
        res.status(500).json({ status: status.error, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.query;
    const { newPassword, confirmNewPassword } = req.body;

    // Validate token
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
        return res.status(400).json({ status: status.error, message: 'A valid token is required' });
    }

    // Validate newPassword
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ status: status.error, message: 'New password is required and must be at least 6 characters long' });
    }

    // Validate confirmNewPassword
    if (!confirmNewPassword || typeof confirmNewPassword !== 'string') {
        return res.status(400).json({ status: status.error, message: 'Confirm password is required' });
    }
    if (confirmNewPassword !== newPassword) {
        return res.status(400).json({ status: status.error, message: 'New password and confirm password must match' });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() },
            },
        });

        if (!user) {
            return res.status(400).json({ status: status.error, message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
                updatedAt: new Date(),
            },
        });

        res.status(200).json({
            status: status.success,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        let errorMessage = 'Server error';
        if (error.message) {
            errorMessage = error.message;
        }
        res.status(500).json({ status: status.error, message: errorMessage });
    }
};

import crypto from 'crypto';
import db from '../dbConnection/db.js';
import { sendResetEmail } from '../utils/sendResetEmail.js';

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const resetResponse = 'If that email exists, a reset link has been sent';

const requestReset = async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
        return res.status(400).send('Email is required');
    }

    try {
        const [user] = await db.execute(
            'SELECT id FROM users WHERE email = ? AND is_active = 1',
            [email]
        );

        if (user.length === 0) {
            return res.send(resetResponse);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = hashResetToken(token);
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await db.execute(
            'UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?',
            [hashedToken, expiry, email]
        );

        try {
            await sendResetEmail(email, token);
        } catch (emailError) {
            await db.execute(
                'UPDATE users SET reset_token=NULL, reset_token_expiry=NULL WHERE email=?',
                [email]
            );

            console.error('Failed to send reset email:', emailError);
            return res.status(503).json({
                message: 'Password reset email service is unavailable. Please try again later.'
            });
        }

        res.send(resetResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export default requestReset;

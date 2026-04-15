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
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (user.length === 0) {
            return res.send(resetResponse);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const hashedToken = hashResetToken(token);
        const expiry = Date.now() + 15 * 60 * 1000;

        await db.execute(
            'UPDATE users SET resetToken=?, resetTokenExpiry=? WHERE email=?',
            [hashedToken, expiry, email]
        );

        await sendResetEmail(email, token);

        res.send(resetResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export default requestReset;

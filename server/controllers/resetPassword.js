import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../dbConnection/db.js';

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).send('Token and password required');
    }

    if (newPassword.length < 8) {
        return res.status(400).send('Password must be at least 8 characters');
    }

    try {
        const hashedToken = hashResetToken(token);
        const [user] = await db.execute(
            'SELECT id FROM users WHERE reset_token=? AND reset_token_expiry > NOW() AND is_active = 1',
            [hashedToken]
        );

        if (user.length === 0) {
            return res.status(400).send('Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.execute(
            `UPDATE users 
             SET password=?, reset_token=NULL, reset_token_expiry=NULL 
             WHERE id=?`,
            [hashedPassword, user[0].id]
        );

        res.send('Password reset successful');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

export default resetPassword;

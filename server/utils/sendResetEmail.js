import { sendEmail } from './resendClient.js';

export const sendResetEmail = async (email, token) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl.replace(/\/$/, '')}/reset-password/${token}`;

    try {
        const result = await sendEmail({
            from: 'noreply@techno-communications.com', // replace with your verified domain later
            to: email,
            subject: 'Reset your password',
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link expires in 15 minutes.</p>
            `
        });

        return { ...result, resetLink };
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('Reset email delivery skipped in non-production:', error.message);
            console.warn(`Password reset link for ${email}: ${resetLink}`);
            return { skipped: true, resetLink };
        }

        throw error;
    }
};

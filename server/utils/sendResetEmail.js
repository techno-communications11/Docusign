import { sendEmail } from './resendClient.js';

const isLocalClientUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        return ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
    } catch {
        return false;
    }
};

export const sendResetEmail = async (email, token) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl.replace(/\/$/, '')}/reset-password/${token}`;
    const shouldAllowLocalFallback = isLocalClientUrl(clientUrl);

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
        if (shouldAllowLocalFallback) {
            console.warn('Reset email delivery skipped for local environment:', error.message);
            console.warn(`Password reset link for ${email}: ${resetLink}`);
            return { skipped: true, resetLink };
        }

        throw error;
    }
};

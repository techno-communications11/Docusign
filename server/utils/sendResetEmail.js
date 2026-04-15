import { sendEmail } from './resendClient.js';

export const sendResetEmail = async (email, token) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetLink = `${clientUrl.replace(/\/$/, '')}/reset-password/${token}`;

    await sendEmail({
        from: 'noreplay@techno-communications.com', // replace with your verified domain later
        to: email,
        subject: 'Reset your password',
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link expires in 15 minutes.</p>
        `
    });
};

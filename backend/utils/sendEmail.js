import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    // If environment variables are missing, fallback to console log
    const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!hasSmtpConfig) {
        console.log('\n=============================================================');
        console.log('⚠️  SMTP is NOT configured in .env file.');
        console.log(`📩  EMAIL FALLBACK LOGGING:`);
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message:\n${options.message}`);
        console.log('=============================================================\n');
        return { success: true, loggedToConsole: true };
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_FROM || `"LibraFlow Support" <noreply@libraflow.com>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || `<p>${options.message}</p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email via nodemailer:', error);
        // Do not crash the application, log and return error
        return { success: false, error: error.message };
    }
};

export default sendEmail;

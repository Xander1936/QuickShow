import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.SENDER_EMAIL || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP_USER, SMTP_PASS, and SENDER_EMAIL must be configured to send email.');
    }

    return transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        html,
    });
};

export default sendEmail;

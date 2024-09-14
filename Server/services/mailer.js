const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail({ to, subject, text, html }) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
            }
        });

        const info = await transporter.sendMail({
            from: {
            name: "Bhavya Prajapati",
            address: process.env.EMAIL_USERNAME
            },
            to: to,
            subject: subject,
            text: text,
            html: html
        });

        // console.log('Email sent: ' + info.response);
        return { message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

module.exports = {
    sendMail
};

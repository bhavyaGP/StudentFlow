const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail({ to, subject, text }) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #4CAF50;">Welcome to Our Community!</h2>
            <p>Dear ${to},</p>
            <p>We are thrilled to have you join us. Here are some details to get you started:</p>
            <ul>
                <li><strong>Message:</strong> ${text}</li>
            </ul>
            <p>Feel free to reach out if you have any questions.</p>
            <p>Best regards,</p>
            <p>Bhavya Prajapati</p>
            </div>
        `;

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

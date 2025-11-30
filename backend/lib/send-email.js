require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

async function sendVerificationEmail(id , to) {
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333;">Welcome to Yalla Fantasy!</h2>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a href="${process.env.ALLOW_CORS_URL}/?verify-email=${id}" 
               style="display: inline-block; padding: 10px 20px; margin: 15px 0; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"
               target="_blank"
            >
                Verify Email Address
            </a>
            <p style="font-size: 0.9em; color: #777;">
                If you did not sign up for Yalla Fantasy, please ignore this email.
            </p>
            <p style="font-size: 0.8em; color: #aaa;">
                If the button above doesn't work, copy and paste this link into your browser: <br>
                <a href="">Link</a>
            </p>
        </div>
    `;


    const textContent = `
        Welcome to Yalla Fantasy!
        Thank you for signing up. Please verify your email address using this link:
        Link
        If you did not sign up for Yalla Fantasy, please ignore this email.
    `;
    try {
        
        const info = await transporter.sendMail({
            from: `"Yalla Fantasy" <${process.env.EMAIL_USER}>`,
            to , 
            subject: "Email Verification",
            html: htmlContent ,
            text : textContent
        });
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { sendVerificationEmail }
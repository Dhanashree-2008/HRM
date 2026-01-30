
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: "gmail", // Use 'gmail' or provide host/port for other providers
    auth: {
        user: process.env.EMAIL_USER, // Generated ethereal user or your real email
        pass: process.env.EMAIL_PASS, // Generated ethereal password or your real password (App Password)
    },
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `LiteHR <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html, // html body
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

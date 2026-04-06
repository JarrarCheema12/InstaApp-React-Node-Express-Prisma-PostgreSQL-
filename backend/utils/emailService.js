import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config({})

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (email,verifyLink = null) => {
    console.log(process.env.EMAIL_USER);
    
    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Click the link below to verify your email. This link will expire in 10 minutes.\n\n${verifyLink}`
    });
};

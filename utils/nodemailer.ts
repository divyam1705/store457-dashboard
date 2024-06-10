import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // or any other email service
  port:587,
  secure:false,
  auth: {
    user: process.env.EMAIL, // your email
    pass: process.env.EMAIL_PASSWORD, // your email password
  },
});

export default transporter;

const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendNotification = async (userEmail, semster, session) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Result Release",
            html: `
                <div>
                    <h2>Release of Results 🎉</h2>
                    <p>
                        Your results have been resleased for ${semster}, ${session} session, 
                        login to your portal to check your results and reach out to any admins 
                        if you have any issues with it
                    </p>
                </div>
            `
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Node mailer error:', error);
    }
};

module.exports = { sendNotification };
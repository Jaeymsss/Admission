const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');

module.exports = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: Number(process.env.EMAIL_PORT),
            secure: Boolean(process.env.SECURE),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Admission',
                link: 'http://localhost:5173/',
            }
        });

        const emailBody = {
            body: {
                intro: "You have 24 hours to verify your account, after which this link will expire. If your link expires, your application will automatically be removed.",
                action: {
                    instruction : 'Please click the button below to verify your email address.',
                    button: {
                        color: '#3B82F6',
                        text: 'Verify Email Address',
                        link: text
                    }
                },
                outro: 'If you have any questions, feel free to reply to this email.'
            }
        };

        const emailTemplate = mailGenerator.generate(emailBody);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: emailTemplate
        });
        console.log("The email was sent successfully.");
    } catch(e) {
        console.log(e.message);
    }
}
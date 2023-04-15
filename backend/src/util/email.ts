import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const options: SMTPTransport.Options = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
};

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    options.auth = {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    };
}

const transporter = nodemailer.createTransport(options);

/**
 *  @param {string} to - Email address of recipient
 *  @param {string} subject - Email subject
 *  @param {string} text - Plain text email body
 *  @param {string=} html - HTML email body
 *  @returns {PromiseLike<SMTPTransport.SentMessageInfo>} - Promise with sent message info
 */
export const sendMail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
): Promise<SMTPTransport.SentMessageInfo> => {
    return transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text,
        html,
    });
};

export default transporter;

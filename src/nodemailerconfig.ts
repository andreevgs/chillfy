import SMTPTransport from "nodemailer/lib/smtp-transport";
import * as dotenv from 'dotenv';

dotenv.config();
const config: SMTPTransport.Options = {
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
}

export default config;
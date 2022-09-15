import {Injectable} from '@nestjs/common';
import Mail from "nodemailer/lib/mailer";
import {createTransport} from "nodemailer";
import config from "../nodemailerconfig";

@Injectable()
export class EmailingService {
    private nodemailerTransport: Mail;

    constructor() {
        this.nodemailerTransport = createTransport(config);
    }

    async sendMail(options: Mail.Options) {
        return await this.nodemailerTransport.sendMail(options);
    }
}

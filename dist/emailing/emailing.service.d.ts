import Mail from "nodemailer/lib/mailer";
export declare class EmailingService {
    private nodemailerTransport;
    constructor();
    sendMail(options: Mail.Options): Promise<any>;
}

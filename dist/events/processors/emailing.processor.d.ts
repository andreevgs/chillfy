import { Job } from 'bull';
import { EmailingService } from "../../emailing/emailing.service";
export declare class EmailingProcessor {
    private readonly emailingService;
    constructor(emailingService: EmailingService);
    remindAboutEvent(job: Job): Promise<void>;
}

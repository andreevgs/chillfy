import { Job } from 'bull';
import { EventsService } from "../events.service";
import { EmailingService } from "../../emailing/emailing.service";
export declare class EventsProcessor {
    private readonly eventsService;
    private readonly emailingService;
    constructor(eventsService: EventsService, emailingService: EmailingService);
    deleteEvent(job: Job): Promise<void>;
    remindAboutEvent(job: Job): Promise<void>;
}

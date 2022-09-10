import { Job } from 'bull';
import { EventsService } from "../events.service";
export declare class EventsProcessor {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    deleteEvent(job: Job): Promise<void>;
}

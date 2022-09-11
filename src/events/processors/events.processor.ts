import {Process, Processor} from '@nestjs/bull';
import {Job} from 'bull';
import {EventsService} from "../events.service";

@Processor('events')
export class EventsProcessor {

    constructor(
        private readonly eventsService: EventsService
    ) {
    }

    @Process('delete')
    async deleteEvent(job: Job) {
        console.log('deletion');
        await this.eventsService.deleteEvent(job.data.req, job.data.eventId);
    }
}
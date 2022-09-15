import {Process, Processor} from '@nestjs/bull';
import {Job} from 'bull';
import {EventsService} from "../events.service";
import {EmailingService} from "../../emailing/emailing.service";

@Processor('events')
export class EventsProcessor {

    constructor(
        private readonly eventsService: EventsService,
        private readonly emailingService: EmailingService
    ) {
    }

    @Process('delete')
    async deleteEvent(job: Job) {
        console.log('deletion');
        await this.eventsService.deleteEvent(job.data.req, job.data.eventId);
    }

    @Process('remind')
    async remindAboutEvent(job: Job) {
        console.log('remind');
        this.emailingService.sendMail({
            to: job.data.invitation.user.email,
            subject: `Reminding about ${job.data.invitation.event.name}`,
            text:
                `We remind you that the event has begun!`
        })
    }
}
import {Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards} from '@nestjs/common';
import {EventsService} from './events.service';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {UserRequestInterface} from "../users/types/user-request.interface";
import {AccessTokenGuard} from "../auth/guards/access-token.guard";
import {CreateInvitationDto} from "./dto/create-invitation.dto";
import {UpdateInvitationDto} from "./dto/update-invitation.dto";
import {EmailingService} from "../emailing/emailing.service";
import {AccountService} from "../account/account.service";
import { InjectQueue } from '@nestjs/bull';
import {Queue} from "bull";
import {parse, stringify} from 'flatted';

@UseGuards(AccessTokenGuard)
@Controller('events')
export class EventsController {
    constructor(
        @InjectQueue('events') private eventsQueue: Queue,
        private readonly eventsService: EventsService,
        private readonly emailingService: EmailingService,
        private readonly accountService: AccountService,
    ) {
    }

    @Post()
    async createEvent(
        @Req() req: UserRequestInterface,
        @Body("event") createEventDto: CreateEventDto
    ) {
        const event = await this.eventsService.createEvent(req, createEventDto);
        this.eventsQueue.add('delete', {req: {user: req.user, refreshToken: req.refreshToken}, eventId: event.id}, {delay: new Date(event.date).getTime() - new Date().getTime()});
        return {event};
    }

    @Get()
    async findAllEvents(@Req() req: UserRequestInterface) {
        const events = await this.eventsService.findAllEvents(req);
        return {events};
    }

    @Get('invitations')
    async findInvitations(@Req() req: UserRequestInterface) {
        const invitations = await this.eventsService.findInvitations(req);
        return {invitations};
    }

    @Get(':id')
    async findEvent(@Param('id') id: string) {
        const event = await this.eventsService.findEvent(+id);
        return {event};
    }

    @Patch(':eventId')
    async updateEvent(@Param('eventId') eventId: string, @Body('event') updateEventDto: UpdateEventDto) {
        const event = await this.eventsService.updateEvent(+eventId, updateEventDto);
        return {event};
    }

    @Get(':eventId/uninvited')
    async findUninvitedContacts(@Req() req: UserRequestInterface, @Param('eventId') eventId: string) {
        const contactRequests = await this.accountService.findContacts(req, {});
        const invitations = await this.eventsService.findEventInvitations(req, +eventId);
        const filteredContactRequests = this.eventsService.filterContactRequestsToGetUninvited(req, contactRequests, invitations);
        return {contacts: filteredContactRequests}
    }

    @Post(':eventId/invitations')
    async createInvitation(
        @Req() req: UserRequestInterface,
        @Body("invitation") createInvitationDto: CreateInvitationDto
    ) {
        const invitation = await this.eventsService.createInvitation(req, createInvitationDto);
        this.emailingService.sendMail({
            to: invitation.user.email,
            subject: 'New invitation to event',
            text:
                `${invitation.event.creator.firstName} ${invitation.event.creator.lastName} invited 
                you for ${invitation.event.name} at ${invitation.event.date}`
        });
        return {invitation};
    }

    @Get(':eventId/invitations')
    async findEventInvitations(@Param('eventId') eventId: string, @Req() req: UserRequestInterface) {
        const invitations = await this.eventsService.findEventInvitations(req, +eventId);
        return {invitations};
    }

    @Get(':eventId/invitations/:invitationId')
    async findEventInvitation(
        @Param('eventId') eventId: string,
        @Param('invitationId') invitationId: string,
        @Req() req: UserRequestInterface
    ) {
        const invitation = await this.eventsService.findEventInvitation(req, +eventId, +invitationId);
        return {invitation};
    }

    @Patch(':eventId/invitations/:invitationId')
    async updateEventInvitation(
        @Param('eventId') eventId: string,
        @Param('invitationId') invitationId: string,
        @Req() req: UserRequestInterface,
        @Body('invitation') updateInvitationDto: UpdateInvitationDto
    ) {
        const invitation = await this.eventsService.updateEventInvitation(req, +eventId, +invitationId, updateInvitationDto);
        return {invitation};
    }

    @Delete(':eventId')
    async deleteEvent(
        @Req() req: UserRequestInterface,
        @Param('eventId') eventId: string
    ) {
        const invitationsOfEvent = await this.eventsService.findEventInvitations(req, +eventId);
        const deletion = await this.eventsService.deleteEvent(req, +eventId);
        const emails = invitationsOfEvent.map(invitation => {
            return invitation.user.email
        });
        if(invitationsOfEvent.length && emails.length){
            this.emailingService.sendMail({
                to: emails,
                subject: 'Event was deleted',
                text:
                    `${invitationsOfEvent[0].event.name} was deleted by creator :(`
            });
        }
        return deletion;
    }

    @Delete(':eventId/invitations/:invitationId')
    async deleteEventInvitation(
        @Param('eventId') eventId: string,
        @Param('invitationId') invitationId: string,
        @Req() req: UserRequestInterface,
    ) {
        const invitationForDelete = await this.eventsService.findEventInvitation(req, +eventId, +invitationId);
        const deletion = await this.eventsService.deleteEventInvitation(req, +eventId, +invitationId);
        this.emailingService.sendMail({
            to: invitationForDelete.user.email,
            subject: 'Invitation was canceled',
            text:
                `${invitationForDelete.user.firstName} ${invitationForDelete.user.lastName}, creator 
                canceled invitation to you for ${invitationForDelete.event.name} at ${invitationForDelete.event.date}`
        });
        return deletion;
    }

}

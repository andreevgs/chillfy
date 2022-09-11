"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const create_event_dto_1 = require("./dto/create-event.dto");
const update_event_dto_1 = require("./dto/update-event.dto");
const access_token_guard_1 = require("../auth/guards/access-token.guard");
const create_invitation_dto_1 = require("./dto/create-invitation.dto");
const update_invitation_dto_1 = require("./dto/update-invitation.dto");
const emailing_service_1 = require("../emailing/emailing.service");
const account_service_1 = require("../account/account.service");
const bull_1 = require("@nestjs/bull");
let EventsController = class EventsController {
    constructor(eventsQueue, eventsService, emailingService, accountService) {
        this.eventsQueue = eventsQueue;
        this.eventsService = eventsService;
        this.emailingService = emailingService;
        this.accountService = accountService;
    }
    async createEvent(req, createEventDto) {
        const event = await this.eventsService.createEvent(req, createEventDto);
        return { event };
    }
    async findAllEvents(req) {
        const events = await this.eventsService.findAllEvents(req);
        return { events };
    }
    async findInvitations(req) {
        const invitations = await this.eventsService.findInvitations(req);
        return { invitations };
    }
    async findEvent(id) {
        const event = await this.eventsService.findEvent(+id);
        return { event };
    }
    async updateEvent(eventId, updateEventDto) {
        const event = await this.eventsService.updateEvent(+eventId, updateEventDto);
        return { event };
    }
    async findUninvitedContacts(req, eventId) {
        const contactRequests = await this.accountService.findContacts(req, {});
        const invitations = await this.eventsService.findEventInvitations(req, +eventId);
        const filteredContactRequests = this.eventsService.filterContactRequestsToGetUninvited(req, contactRequests, invitations);
        return { contacts: filteredContactRequests };
    }
    async createInvitation(req, createInvitationDto) {
        const invitation = await this.eventsService.createInvitation(req, createInvitationDto);
        this.emailingService.sendMail({
            to: invitation.user.email,
            subject: 'New invitation to event',
            text: `${invitation.event.creator.firstName} ${invitation.event.creator.lastName} invited 
                you for ${invitation.event.name} at ${invitation.event.date}`
        });
        return { invitation };
    }
    async findEventInvitations(eventId, req) {
        const invitations = await this.eventsService.findEventInvitations(req, +eventId);
        return { invitations };
    }
    async findEventInvitation(eventId, invitationId, req) {
        const invitation = await this.eventsService.findEventInvitation(req, +eventId, +invitationId);
        return { invitation };
    }
    async updateEventInvitation(eventId, invitationId, req, updateInvitationDto) {
        const invitation = await this.eventsService.updateEventInvitation(req, +eventId, +invitationId, updateInvitationDto);
        return { invitation };
    }
    async deleteEvent(req, eventId) {
        const invitationsOfEvent = await this.eventsService.findEventInvitations(req, +eventId);
        const deletion = await this.eventsService.deleteEvent(req, +eventId);
        const emails = invitationsOfEvent.map(invitation => {
            return invitation.user.email;
        });
        if (invitationsOfEvent.length && emails.length) {
            this.emailingService.sendMail({
                to: emails,
                subject: 'Event was deleted',
                text: `${invitationsOfEvent[0].event.name} was deleted by creator :(`
            });
        }
        return deletion;
    }
    async deleteEventInvitation(eventId, invitationId, req) {
        const invitationForDelete = await this.eventsService.findEventInvitation(req, +eventId, +invitationId);
        const deletion = await this.eventsService.deleteEventInvitation(req, +eventId, +invitationId);
        this.emailingService.sendMail({
            to: invitationForDelete.user.email,
            subject: 'Invitation was canceled',
            text: `${invitationForDelete.user.firstName} ${invitationForDelete.user.lastName}, creator 
                canceled invitation to you for ${invitationForDelete.event.name} at ${invitationForDelete.event.date}`
        });
        return deletion;
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("event")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findAllEvents", null);
__decorate([
    (0, common_1.Get)('invitations'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findInvitations", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findEvent", null);
__decorate([
    (0, common_1.Patch)(':eventId'),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Body)('event')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_event_dto_1.UpdateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateEvent", null);
__decorate([
    (0, common_1.Get)(':eventId/uninvited'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findUninvitedContacts", null);
__decorate([
    (0, common_1.Post)(':eventId/invitations'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)("invitation")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invitation_dto_1.CreateInvitationDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createInvitation", null);
__decorate([
    (0, common_1.Get)(':eventId/invitations'),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findEventInvitations", null);
__decorate([
    (0, common_1.Get)(':eventId/invitations/:invitationId'),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Param)('invitationId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "findEventInvitation", null);
__decorate([
    (0, common_1.Patch)(':eventId/invitations/:invitationId'),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Param)('invitationId')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Body)('invitation')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, update_invitation_dto_1.UpdateInvitationDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "updateEventInvitation", null);
__decorate([
    (0, common_1.Delete)(':eventId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "deleteEvent", null);
__decorate([
    (0, common_1.Delete)(':eventId/invitations/:invitationId'),
    __param(0, (0, common_1.Param)('eventId')),
    __param(1, (0, common_1.Param)('invitationId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "deleteEventInvitation", null);
EventsController = __decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.Controller)('events'),
    __param(0, (0, bull_1.InjectQueue)('events')),
    __metadata("design:paramtypes", [Object, events_service_1.EventsService,
        emailing_service_1.EmailingService,
        account_service_1.AccountService])
], EventsController);
exports.EventsController = EventsController;
//# sourceMappingURL=events.controller.js.map
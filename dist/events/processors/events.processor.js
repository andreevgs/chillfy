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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const events_service_1 = require("../events.service");
const emailing_service_1 = require("../../emailing/emailing.service");
let EventsProcessor = class EventsProcessor {
    constructor(eventsService, emailingService) {
        this.eventsService = eventsService;
        this.emailingService = emailingService;
    }
    async deleteEvent(job) {
        console.log('deletion');
        await this.eventsService.deleteEvent(job.data.req, job.data.eventId);
    }
    async remindAboutEvent(job) {
        console.log('remind');
        this.emailingService.sendMail({
            to: job.data.invitation.user.email,
            subject: `Reminding about ${job.data.invitation.event.name}`,
            text: `We remind you that the event has begun!`
        });
    }
};
__decorate([
    (0, bull_1.Process)('delete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsProcessor.prototype, "deleteEvent", null);
__decorate([
    (0, bull_1.Process)('remind'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsProcessor.prototype, "remindAboutEvent", null);
EventsProcessor = __decorate([
    (0, bull_1.Processor)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        emailing_service_1.EmailingService])
], EventsProcessor);
exports.EventsProcessor = EventsProcessor;
//# sourceMappingURL=events.processor.js.map
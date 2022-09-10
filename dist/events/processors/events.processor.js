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
let EventsProcessor = class EventsProcessor {
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async deleteEvent(job) {
        await this.eventsService.deleteEvent(job.data.req, job.data.eventId);
    }
};
__decorate([
    (0, bull_1.Process)('delete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsProcessor.prototype, "deleteEvent", null);
EventsProcessor = __decorate([
    (0, bull_1.Processor)('events'),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsProcessor);
exports.EventsProcessor = EventsProcessor;
//# sourceMappingURL=events.processor.js.map
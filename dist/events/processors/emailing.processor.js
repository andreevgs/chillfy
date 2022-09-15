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
exports.EmailingProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const emailing_service_1 = require("../../emailing/emailing.service");
let EmailingProcessor = class EmailingProcessor {
    constructor(emailingService) {
        this.emailingService = emailingService;
    }
    async remindAboutEvent(job) {
        console.log('reminding');
        await this.emailingService.sendMail({
            to: job.data.user.email,
            subject: `Reminding about ${job.data.invitation.event.name}`,
            text: `We remind you that the event has begun!`
        });
    }
};
__decorate([
    (0, bull_1.Process)('remind'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmailingProcessor.prototype, "remindAboutEvent", null);
EmailingProcessor = __decorate([
    (0, bull_1.Processor)('emailing'),
    __metadata("design:paramtypes", [emailing_service_1.EmailingService])
], EmailingProcessor);
exports.EmailingProcessor = EmailingProcessor;
//# sourceMappingURL=emailing.processor.js.map
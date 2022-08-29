"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const events_controller_1 = require("./events.controller");
const typeorm_1 = require("@nestjs/typeorm");
const event_entity_1 = require("./entities/event.entity");
const invitation_entity_1 = require("./entities/invitation.entity");
const emailing_service_1 = require("../emailing/emailing.service");
const user_entity_1 = require("../users/entities/user.entity");
const account_service_1 = require("../account/account.service");
const contact_request_entity_1 = require("../account/entities/contact-request.entity");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([event_entity_1.EventEntity, invitation_entity_1.InvitationEntity, user_entity_1.UserEntity, contact_request_entity_1.ContactRequestEntity])],
        controllers: [events_controller_1.EventsController],
        providers: [events_service_1.EventsService, emailing_service_1.EmailingService, account_service_1.AccountService]
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map
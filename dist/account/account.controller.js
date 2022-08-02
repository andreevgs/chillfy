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
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const access_token_guard_1 = require("../auth/guards/access-token.guard");
const create_contact_request_dto_1 = require("./dto/create-contact-request.dto");
const change_contact_request_dto_1 = require("./dto/change-contact-request.dto");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    async findContacts(req) {
        const contacts = await this.accountService.findContacts(req);
        return { contacts };
    }
    async createContactRequest(req, createContactRequestDto) {
        const request = await this.accountService.createContactRequest(req, createContactRequestDto);
        return { request };
    }
    async changeContactRequest(requestId, req, changeContactRequestDto) {
        const request = this.accountService.changeContactRequest(+requestId, req, changeContactRequestDto);
        return { request };
    }
    deleteContactRequest(req, requestId) {
        return this.accountService.deleteContactRequest(+requestId, req);
    }
    deleteFromContacts(req, userId) {
        return '';
    }
};
__decorate([
    (0, common_1.Get)('contacts'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "findContacts", null);
__decorate([
    (0, common_1.Post)('contacts/requests'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('request')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contact_request_dto_1.CreateContactRequestDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "createContactRequest", null);
__decorate([
    (0, common_1.Patch)('contacts/requests/:requestId'),
    __param(0, (0, common_1.Param)('requestId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('request')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, change_contact_request_dto_1.ChangeContactRequestDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "changeContactRequest", null);
__decorate([
    (0, common_1.Delete)('contacts/requests/:requestId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('requestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "deleteContactRequest", null);
__decorate([
    (0, common_1.Delete)('contacts/:userId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AccountController.prototype, "deleteFromContacts", null);
AccountController = __decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccessTokenGuard),
    (0, common_1.Controller)('account'),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map
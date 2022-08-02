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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const contact_request_entity_1 = require("./entities/contact-request.entity");
const create_contact_request_dto_1 = require("./dto/create-contact-request.dto");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const change_contact_request_dto_1 = require("./dto/change-contact-request.dto");
let AccountService = class AccountService {
    constructor(dataSource, contactRequestRepository) {
        this.dataSource = dataSource;
        this.contactRequestRepository = contactRequestRepository;
    }
    async findContacts(req) {
        return await this.contactRequestRepository.find({
            where: [
                { firstUser: { id: req.user.id } },
                { secondUser: { id: req.user.id } }
            ],
            relations: ['firstUser', 'secondUser']
        });
    }
    async createContactRequest(req, createContactRequestDto) {
        let savedContactRequest;
        const existContactRequest = await this.contactRequestRepository.findOne({
            where: [
                { firstUser: { id: req.user.id }, secondUser: { id: createContactRequestDto.secondUserId } },
                { firstUser: { id: createContactRequestDto.secondUserId }, secondUser: { id: req.user.id } },
            ]
        });
        if (existContactRequest) {
            throw new common_1.HttpException('contact request is already exists', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const secondUser = await queryRunner.manager.findOne(user_entity_1.UserEntity, {
                where: {
                    id: createContactRequestDto.secondUserId
                }
            });
            const contactRequestRestored = await queryRunner.manager.restore(contact_request_entity_1.ContactRequestEntity, {
                firstUser: req.user,
                secondUser: secondUser,
                status: (0, typeorm_1.IsNull)()
            });
            if (!contactRequestRestored.affected) {
                const newContactRequest = new contact_request_entity_1.ContactRequestEntity();
                newContactRequest.firstUser = req.user;
                newContactRequest.secondUser = secondUser;
                savedContactRequest = await queryRunner.manager.save(newContactRequest);
            }
            else {
                savedContactRequest = await queryRunner.manager.findOne(contact_request_entity_1.ContactRequestEntity, {
                    where: { firstUser: { id: req.user.id }, secondUser: { id: secondUser.id } },
                    relations: ['firstUser', 'secondUser']
                });
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
        return savedContactRequest;
    }
    async changeContactRequest(requestId, req, changeContactRequestDto) {
        let contactRequest = await this.contactRequestRepository.findOne({
            where: { id: requestId, status: null }
        });
        if (!contactRequest) {
            throw new common_1.HttpException('contact request is not found', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(contact_request_entity_1.ContactRequestEntity, { id: requestId }, {
                status: changeContactRequestDto.status
            });
            contactRequest = await queryRunner.manager.findOne(contact_request_entity_1.ContactRequestEntity, { where: { id: requestId } });
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
        return contactRequest;
    }
    async deleteContactRequest(requestId, req) {
        let contactRequest = await this.contactRequestRepository.findOne({
            where: { id: requestId, status: null, firstUser: { id: req.user.id } }
        });
        if (!contactRequest) {
            throw new common_1.HttpException('contact request is not found', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let responseText;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.softDelete(contact_request_entity_1.ContactRequestEntity, { id: requestId });
            await queryRunner.commitTransaction();
            responseText = 'ok';
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            responseText = 'error deleting request';
        }
        finally {
            await queryRunner.release();
        }
        return { message: responseText };
    }
    async deleteFromContacts(req, userId) {
        return { message: '' };
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountService.prototype, "findContacts", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contact_request_dto_1.CreateContactRequestDto]),
    __metadata("design:returntype", Promise)
], AccountService.prototype, "createContactRequest", null);
__decorate([
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)('request')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, change_contact_request_dto_1.ChangeContactRequestDto]),
    __metadata("design:returntype", Promise)
], AccountService.prototype, "changeContactRequest", null);
__decorate([
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], AccountService.prototype, "deleteContactRequest", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AccountService.prototype, "deleteFromContacts", null);
AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(contact_request_entity_1.ContactRequestEntity)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map
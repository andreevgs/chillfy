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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const create_event_dto_1 = require("./dto/create-event.dto");
const event_entity_1 = require("./entities/event.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const invitation_entity_1 = require("./entities/invitation.entity");
const user_entity_1 = require("../users/entities/user.entity");
const update_invitation_dto_1 = require("./dto/update-invitation.dto");
const status_entity_1 = require("./entities/status.entity");
const create_invitations_dto_1 = require("./dto/create-invitations.dto");
let EventsService = class EventsService {
    constructor(dataSource, eventRepository, usersRepository, invitationRepository) {
        this.dataSource = dataSource;
        this.eventRepository = eventRepository;
        this.usersRepository = usersRepository;
        this.invitationRepository = invitationRepository;
    }
    async createEvent(req, createEventDto) {
        const newEvent = new event_entity_1.EventEntity();
        Object.assign(newEvent, createEventDto);
        newEvent.creator = req.user;
        const createdEvent = await this.eventRepository.save(newEvent);
        const invitations = createEventDto.invitations.map(invitation => ({
            eventId: createdEvent.id,
            userId: invitation.userId
        }));
        await this.createInvitations(req, {
            invitations
        });
        return createdEvent;
    }
    async updateEvent(eventId, updateEventDto) {
        let event = await this.eventRepository.findOne({ where: { id: eventId } });
        if (!event) {
            throw new common_1.HttpException('event not found', common_1.HttpStatus.NOT_FOUND);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(event_entity_1.EventEntity, { id: eventId }, Object.assign({}, updateEventDto));
            event = await queryRunner.manager.findOne(event_entity_1.EventEntity, { where: { id: eventId } });
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
        return event;
    }
    async findAllEvents(req) {
        return await this.eventRepository.find({ where: { creator: { id: req.user.id } } });
    }
    async findEvent(id) {
        return await this.eventRepository.findOne({ where: { id } });
    }
    async createInvitations(req, createInvitationsDto) {
        let savedInvitations;
        const event = await this.eventRepository.findOne({
            where: { id: createInvitationsDto.invitations[0].eventId, creator: { id: req.user.id } }
        });
        if (!event) {
            throw new common_1.HttpException('event is not exist', common_1.HttpStatus.NOT_FOUND);
        }
        const existInvitations = await this.invitationRepository.find({
            where: {
                user: createInvitationsDto.invitations.map(invitation => ({ id: invitation.userId })),
                event: { id: createInvitationsDto.invitations[0].eventId }
            }
        });
        if (existInvitations.length) {
            throw new common_1.HttpException(`invitation is already exists`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invitedUsers = await queryRunner.manager.find(user_entity_1.UserEntity, {
                where: createInvitationsDto.invitations.map(invitation => ({ id: invitation.userId }))
            });
            const invitationRestored = await queryRunner.manager.restore(invitation_entity_1.InvitationEntity, invitedUsers.map(invitedUser => ({
                event: { id: createInvitationsDto.invitations[0].eventId },
                status: (0, typeorm_1.IsNull)(),
                user: { id: invitedUser.id }
            })));
            if (!invitationRestored.affected) {
                const newInvitations = new Array;
                invitedUsers.forEach(invitedUser => {
                    const newInvitation = new invitation_entity_1.InvitationEntity();
                    newInvitation.event = event;
                    newInvitation.user = invitedUser;
                    newInvitations.push(newInvitation);
                });
                savedInvitations = await queryRunner.manager.save(newInvitations);
                savedInvitations = await queryRunner.manager.findOne(invitation_entity_1.InvitationEntity, {
                    where: savedInvitations.map(invitation => ({ id: invitation.id })),
                    relations: ['user', 'event.creator']
                });
            }
            else {
                savedInvitations = await queryRunner.manager.find(invitation_entity_1.InvitationEntity, {
                    where: {
                        user: createInvitationsDto.invitations.map(invitation => ({ id: invitation.userId })),
                        event: { id: createInvitationsDto.invitations[0].eventId }
                    },
                    relations: ['user', 'event.creator']
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
        return savedInvitations;
    }
    async findEventInvitations(req, eventId) {
        return await this.invitationRepository.find({
            where: [
                { event: { id: eventId, creator: { id: req.user.id } } },
                { event: { id: eventId }, user: { id: req.user.id } }
            ],
            relations: ['event', 'user', 'status']
        });
    }
    async findInvitations(req) {
        return await this.invitationRepository.find({
            where: { user: { id: req.user.id } },
            relations: ['event', 'status']
        });
    }
    async findEventInvitation(req, eventId, invitationId) {
        return await this.invitationRepository.findOne({
            where: [
                { id: invitationId, event: { id: eventId }, user: { id: req.user.id } },
                { id: invitationId, event: { id: eventId, creator: { id: req.user.id } } }
            ],
            relations: ['event', 'user']
        });
    }
    async updateEventInvitation(req, eventId, invitationId, updateInvitationDto) {
        const invitationFindOptions = { id: invitationId, event: { id: eventId }, user: { id: req.user.id } };
        let invitation = await this.invitationRepository.findOne({
            where: invitationFindOptions,
            relations: ['event', 'user']
        });
        if (!invitation) {
            throw new common_1.HttpException('invitation not found', common_1.HttpStatus.NOT_FOUND);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const status = await queryRunner.manager.findOne(status_entity_1.StatusEntity, {
                where: { id: updateInvitationDto.statusId }
            });
            await queryRunner.manager.update(invitation_entity_1.InvitationEntity, invitationFindOptions, { status });
            invitation = await queryRunner.manager.findOne(invitation_entity_1.InvitationEntity, {
                where: invitationFindOptions, relations: ['event', 'user', 'status']
            });
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
        return invitation;
    }
    async deleteEvent(req, eventId) {
        let event = await this.eventRepository.findOne({ where: { id: eventId, creator: { id: req.user.id } } });
        if (!event) {
            throw new common_1.HttpException('event not found', common_1.HttpStatus.NOT_FOUND);
        }
        let responseText;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invitations = await queryRunner.manager.find(invitation_entity_1.InvitationEntity, {
                where: { event: { id: eventId } }
            });
            const invitationsDeletionOptions = invitations.map(invitation => ({ id: invitation.id }));
            if (invitationsDeletionOptions.length) {
                await queryRunner.manager.softDelete(invitation_entity_1.InvitationEntity, invitationsDeletionOptions);
            }
            await queryRunner.manager.softDelete(event_entity_1.EventEntity, { id: eventId });
            await queryRunner.commitTransaction();
            responseText = 'ok';
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            responseText = 'error deleting event';
        }
        finally {
            await queryRunner.release();
        }
        return { message: responseText };
    }
    async deleteEventInvitation(req, eventId, invitationId) {
        const invitationFindOptions = { id: invitationId, event: { id: eventId, creator: { id: req.user.id } } };
        let invitation = await this.invitationRepository.findOne({
            where: invitationFindOptions,
            relations: ['event', 'user']
        });
        if (!invitation) {
            throw new common_1.HttpException('invitation not found', common_1.HttpStatus.NOT_FOUND);
        }
        let responseText;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.softDelete(invitation_entity_1.InvitationEntity, invitationFindOptions);
            await queryRunner.commitTransaction();
            responseText = 'ok';
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            responseText = 'error deleting invitation';
        }
        finally {
            await queryRunner.release();
        }
        return { message: responseText };
    }
    filterContactRequestsToGetUninvited(req, contactRequests, invitations) {
        return contactRequests.filter(contactRequest => {
            return !invitations.find(invitation => {
                var _a, _b;
                return (invitation.user.id === ((_a = contactRequest.firstUser) === null || _a === void 0 ? void 0 : _a.id)) ||
                    (invitation.user.id === ((_b = contactRequest.secondUser) === null || _b === void 0 ? void 0 : _b.id));
            });
        });
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_event_dto_1.CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "createEvent", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "findAllEvents", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invitations_dto_1.CreateInvitationsDto]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "createInvitations", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "findEventInvitations", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "findInvitations", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "findEventInvitation", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, update_invitation_dto_1.UpdateInvitationDto]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "updateEventInvitation", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "deleteEvent", null);
__decorate([
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], EventsService.prototype, "deleteEventInvitation", null);
EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(event_entity_1.EventEntity)),
    __param(2, (0, typeorm_2.InjectRepository)(user_entity_1.UserEntity)),
    __param(3, (0, typeorm_2.InjectRepository)(invitation_entity_1.InvitationEntity)),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], EventsService);
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map
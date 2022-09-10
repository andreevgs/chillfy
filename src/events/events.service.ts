import {HttpException, HttpStatus, Injectable, Req} from '@nestjs/common';
import {CreateEventDto} from './dto/create-event.dto';
import {UpdateEventDto} from './dto/update-event.dto';
import {EventEntity} from "./entities/event.entity";
import {DataSource, IsNull, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {UserRequestInterface} from "../users/types/user-request.interface";
import {CreateInvitationDto} from "./dto/create-invitation.dto";
import {InvitationEntity} from "./entities/invitation.entity";
import {UserEntity} from "../users/entities/user.entity";
import {UpdateInvitationDto} from "./dto/update-invitation.dto";
import {StatusEntity} from "./entities/status.entity";
import {MessageResponseInterface} from "../shared/types/message-response.interface";
import {EventsQueryDto} from "./dto/events-query.dto";
import {ContactRequestEntity} from "../account/entities/contact-request.entity";

@Injectable()
export class EventsService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(EventEntity)
        private readonly eventRepository: Repository<EventEntity>,
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        @InjectRepository(InvitationEntity)
        private readonly invitationRepository: Repository<InvitationEntity>
    ) {
    }

    async createEvent(@Req() req: UserRequestInterface, createEventDto: CreateEventDto): Promise<EventEntity> {
        const newEvent = new EventEntity();
        Object.assign(newEvent, createEventDto);
        newEvent.creator = req.user;
        return await this.eventRepository.save(newEvent);
    }

    async updateEvent(eventId: number, updateEventDto: UpdateEventDto) {
        let event = await this.eventRepository.findOne({where: {id: eventId}});
        if (!event) {
            throw new HttpException('event not found', HttpStatus.NOT_FOUND);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(
                EventEntity,
                {id: eventId},
                {...updateEventDto}
            );
            event = await queryRunner.manager.findOne(EventEntity, {where: {id: eventId}});
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        return event;
    }

    async findAllEvents(@Req() req: UserRequestInterface): Promise<EventEntity[]> {
        return await this.eventRepository.find({where: {creator: {id: req.user.id}}});
    }

    async findEvent(id: number): Promise<EventEntity> {
        return await this.eventRepository.findOne({where: {id}});
    }

    async createInvitation(
        @Req() req: UserRequestInterface,
        createInvitationDto: CreateInvitationDto
    ): Promise<InvitationEntity> {
        let savedInvitation;
        const event = await this.eventRepository.findOne({
            where: {id: createInvitationDto.eventId, creator: {id: req.user.id}}
        });
        if (!event) {
            throw new HttpException('event is not exist', HttpStatus.NOT_FOUND);
        }
        const existInvitation = await this.invitationRepository.findOne({
            where: {user: {id: createInvitationDto.userId}, event: {id: createInvitationDto.eventId}}
        });
        if (existInvitation) {
            throw new HttpException('invitation is already exists', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invitedUser = await queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: createInvitationDto.userId
                }
            });
            const invitationRestored = await queryRunner.manager.restore(InvitationEntity, {
                event: {id: createInvitationDto.eventId},
                user: {id: createInvitationDto.userId},
                status: IsNull()
            });

            if (!invitationRestored.affected) {
                const newInvitation = new InvitationEntity();
                newInvitation.user = invitedUser;
                newInvitation.event = event;
                savedInvitation = await queryRunner.manager.save(newInvitation);
                savedInvitation = await queryRunner.manager.findOne(InvitationEntity, {
                    where: {id: savedInvitation.id},
                    relations: ['user', 'event.creator']
                });
            } else {
                savedInvitation = await queryRunner.manager.findOne(
                    InvitationEntity,
                    {
                        where: {user: {id: createInvitationDto.userId}, event: {id: createInvitationDto.eventId}},
                        relations: ['user', 'event.creator']
                    }
                );
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        return savedInvitation;
    }

    async findEventInvitations(@Req() req: UserRequestInterface, eventId: number): Promise<InvitationEntity[]> {
        return await this.invitationRepository.find({
            where: [
                {event: {id: eventId, creator: {id: req.user.id}}},
                {event: {id: eventId}, user: {id: req.user.id}}
            ],
            relations: ['event', 'user', 'status']
        });
    }

    async findInvitations(@Req() req: UserRequestInterface): Promise<InvitationEntity[]> {
        return await this.invitationRepository.find({
            where: {user: {id: req.user.id}},
            relations: ['event', 'status']
        });
    }

    async findEventInvitation(
        @Req() req: UserRequestInterface,
        eventId: number,
        invitationId: number
    ): Promise<InvitationEntity> {
        return await this.invitationRepository.findOne({
            where: [
                {id: invitationId, event: {id: eventId}, user: {id: req.user.id}},
                {id: invitationId, event: {id: eventId, creator: {id: req.user.id}}}
            ],
            relations: ['event', 'user']
        });
    }

    async updateEventInvitation(
        @Req() req: UserRequestInterface,
        eventId: number,
        invitationId: number,
        updateInvitationDto: UpdateInvitationDto
    ): Promise<InvitationEntity> {
        const invitationFindOptions = {id: invitationId, event: {id: eventId}, user: {id: req.user.id}};
        let invitation = await this.invitationRepository.findOne({
            where: invitationFindOptions,
            relations: ['event', 'user']
        });
        if (!invitation) {
            throw new HttpException('invitation not found', HttpStatus.NOT_FOUND);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const status = await queryRunner.manager.findOne(StatusEntity, {
                where: {id: updateInvitationDto.statusId}
            });

            await queryRunner.manager.update(
                InvitationEntity,
                invitationFindOptions,
                {status}
            );
            invitation = await queryRunner.manager.findOne(InvitationEntity, {
                where: invitationFindOptions, relations: ['event', 'user', 'status']
            });
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        return invitation;
    }

    async deleteEvent(
        @Req() req: UserRequestInterface,
        eventId: number
    ): Promise<MessageResponseInterface> {
        let event = await this.eventRepository.findOne({where: {id: eventId, creator: {id: req.user.id}}});
        if(!event){
            throw new HttpException('event not found', HttpStatus.NOT_FOUND);
        }
        let responseText;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const invitations = await queryRunner.manager.find(InvitationEntity, {
                where: {event: {id: eventId}}
            });
            const invitationsDeletionOptions = invitations.map(invitation => ({id: invitation.id}));
            if(invitationsDeletionOptions.length){
                await queryRunner.manager.softDelete(InvitationEntity, invitationsDeletionOptions);
            }
            await queryRunner.manager.softDelete(
                EventEntity,
                {id: eventId}
            );
            await queryRunner.commitTransaction();
            responseText = 'ok';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseText = 'error deleting event';
        } finally {
            await queryRunner.release();
        }
        return {message: responseText};
    }

    async deleteEventInvitation(
        @Req() req: UserRequestInterface,
        eventId: number,
        invitationId: number
    ): Promise<MessageResponseInterface> {
        const invitationFindOptions = {id: invitationId, event: {id: eventId, creator: {id: req.user.id}}};
        let invitation = await this.invitationRepository.findOne({
            where: invitationFindOptions,
            relations: ['event', 'user']
        });
        if (!invitation) {
            throw new HttpException('invitation not found', HttpStatus.NOT_FOUND);
        }

        let responseText;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.softDelete(
                InvitationEntity,
                invitationFindOptions
            );
            await queryRunner.commitTransaction();
            responseText = 'ok';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseText = 'error deleting invitation';
        } finally {
            await queryRunner.release();
        }
        return {message: responseText};
    }

    filterContactRequestsToGetUninvited(
        req: UserRequestInterface,
        contactRequests: ContactRequestEntity[],
        invitations: InvitationEntity[]
    ) {
        return contactRequests.filter(contactRequest => {
            return !invitations.find(invitation =>
                (invitation.user.id === contactRequest.firstUser?.id) ||
                (invitation.user.id === contactRequest.secondUser?.id));
        });
    }

}

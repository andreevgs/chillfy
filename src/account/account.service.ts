import {Body, HttpException, HttpStatus, Injectable, Req} from '@nestjs/common';
import {ContactRequestEntity} from "./entities/contact-request.entity";
import {CreateContactRequestDto} from "./dto/create-contact-request.dto";
import {DataSource, Repository, IsNull, Like, Not, In} from "typeorm";
import {UserRequestInterface} from "../users/types/user-request.interface";
import {UserEntity} from "../users/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ChangeContactRequestDto} from "./dto/change-contact-request.dto";
import {MessageResponseInterface} from "../shared/types/message-response.interface";
import {ContactsQueryDto} from "./dto/contacts-query.dto";
import {InvitationEntity} from "../events/entities/invitation.entity";

@Injectable()
export class AccountService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(ContactRequestEntity)
        private readonly contactRequestRepository: Repository<ContactRequestEntity>,
    ) {
    }

    async findContacts(
        req: UserRequestInterface,
        contactsQueryDto: ContactsQueryDto
    ): Promise<ContactRequestEntity[]> {
        for (let parameter in contactsQueryDto) {
            contactsQueryDto[parameter] = Like(`%${contactsQueryDto[parameter]}%`);
        }
        const contactRequests = await this.contactRequestRepository.find({
            where: [
                {firstUser: {id: req.user.id}, secondUser: {...contactsQueryDto}, status: true},
                {secondUser: {id: req.user.id}, firstUser: {...contactsQueryDto}, status: true}
            ],
            relations: ['firstUser', 'secondUser']
        });
        return this.filterContactRequests(req, contactRequests);
    }

    async createContactRequest(
        @Req() req: UserRequestInterface,
        createContactRequestDto: CreateContactRequestDto
    ): Promise<ContactRequestEntity> {
        let savedContactRequest;
        const existContactRequest = await this.contactRequestRepository.findOne({
            where: [
                {firstUser: {id: req.user.id}, secondUser: {id: createContactRequestDto.secondUserId}},
                {firstUser: {id: createContactRequestDto.secondUserId}, secondUser: {id: req.user.id}},
            ]
        });
        if (existContactRequest) {
            throw new HttpException('contact request is already exists', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const secondUser = await queryRunner.manager.findOne(UserEntity, {
                where: {
                    id: createContactRequestDto.secondUserId
                }
            });
            const contactRequestRestored = await queryRunner.manager.restore(ContactRequestEntity, {
                firstUser: req.user,
                secondUser: secondUser,
                status: IsNull()
            });

            if (!contactRequestRestored.affected) {
                const newContactRequest = new ContactRequestEntity();
                newContactRequest.firstUser = req.user;
                newContactRequest.secondUser = secondUser;
                savedContactRequest = await queryRunner.manager.save(newContactRequest);
            } else {
                savedContactRequest = await queryRunner.manager.findOne(
                    ContactRequestEntity,
                    {
                        where: {firstUser: {id: req.user.id}, secondUser: {id: secondUser.id}},
                        relations: ['firstUser', 'secondUser']
                    }
                );
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }

        return savedContactRequest;
    }

    async changeContactRequest(
        requestId: number,
        @Req() req: UserRequestInterface,
        @Body('request') changeContactRequestDto: ChangeContactRequestDto
    ): Promise<ContactRequestEntity> {
        let contactRequest = await this.contactRequestRepository.findOne({
            where: {id: requestId, status: null}
        });
        if (!contactRequest) {
            throw new HttpException('contact request is not found', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(
                ContactRequestEntity,
                {id: requestId},
                {
                    status: changeContactRequestDto.status
                });
            contactRequest = await queryRunner.manager.findOne(ContactRequestEntity, {where: {id: requestId}});
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        return contactRequest;
    }

    async deleteContactRequest(
        requestId: number,
        @Req() req: UserRequestInterface,
    ): Promise<MessageResponseInterface> {
        let contactRequest = await this.contactRequestRepository.findOne({
            where: {id: requestId, status: null, firstUser: {id: req.user.id}}
        });
        if (!contactRequest) {
            throw new HttpException('contact request is not found', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let responseText;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.softDelete(
                ContactRequestEntity,
                {id: requestId}
            );
            await queryRunner.commitTransaction();
            responseText = 'ok';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            responseText = 'error deleting request';
        } finally {
            await queryRunner.release();
        }
        return {message: responseText};
    }

    async deleteFromContacts(req: UserRequestInterface, requestId: number): Promise<MessageResponseInterface> {
        const getUserForDeletionFromContacts = (contactRequest: ContactRequestEntity): UserEntity => {
            return contactRequest.firstUser.id === req.user.id ? contactRequest.secondUser : contactRequest.firstUser;
        }

        let contactRequest = await this.contactRequestRepository.findOne({
            where: [
                    {id: requestId, status: true, firstUser: {id: req.user.id}},
                    {id: requestId, status: true, secondUser: {id: req.user.id}}
                ],
            relations: ['firstUser', 'secondUser']
        });
        if (!contactRequest) {
            throw new HttpException('contact request is not found', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let responseText;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.softDelete(
                ContactRequestEntity,
                {id: requestId}
            );
            const invitationsToDelete = await queryRunner.manager.find(InvitationEntity, {
                where: [
                    {user: {id: req.user.id}, event: {creator: {id: getUserForDeletionFromContacts(contactRequest).id}}},
                    {user: {id: getUserForDeletionFromContacts(contactRequest).id}, event: {creator: {id: req.user.id}}}
                ]
            })
            let invitationsIdsToDelete = invitationsToDelete.map(invitation => invitation.id);
            await queryRunner.manager.softDelete(
                InvitationEntity,
                {id: In(invitationsIdsToDelete)}
            );

            await queryRunner.commitTransaction();
            responseText = 'ok';
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.log(error);
            responseText = 'error deleting from contacts';
        } finally {
            await queryRunner.release();
        }
        return {message: responseText}
    }

    filterContactRequests(req: UserRequestInterface, contactsRequests: ContactRequestEntity[]) {
        return contactsRequests.map(contactsRequest => {
            if (contactsRequest.firstUser.id === req.user.id) contactsRequest.firstUser = null;
            if (contactsRequest.secondUser.id === req.user.id) contactsRequest.secondUser = null;
            return contactsRequest;
        })
    }
}

import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query} from '@nestjs/common';
import {AccountService} from './account.service';
import {AccessTokenGuard} from "../auth/guards/access-token.guard";
import {CreateContactRequestDto} from "./dto/create-contact-request.dto";
import {UserRequestInterface} from "../users/types/user-request.interface";
import {ChangeContactRequestDto} from "./dto/change-contact-request.dto";
import {ContactsQueryDto} from "./dto/contacts-query.dto";

@UseGuards(AccessTokenGuard)
@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {
    }

    @Get('contacts')
    async findContacts(@Req() req: UserRequestInterface, @Query() contactsQueryDto: ContactsQueryDto) {
        const contacts = await this.accountService.findContacts(req, contactsQueryDto);
        return {contacts};
    }

    @Post('contacts/requests')
    async createContactRequest(
        @Req() req: UserRequestInterface,
        @Body('request') createContactRequestDto: CreateContactRequestDto
    ) {
        const request = await this.accountService.createContactRequest(req, createContactRequestDto);
        return {request};
    }

    @Patch('contacts/requests/:requestId')
    async changeContactRequest(
        @Param('requestId') requestId: string,
        @Req() req: UserRequestInterface,
        @Body('request') changeContactRequestDto: ChangeContactRequestDto
    ) {
        const request = this.accountService.changeContactRequest(+requestId, req, changeContactRequestDto);
        return {request};
    }

    @Delete('contacts/requests/:requestId')
    deleteContactRequest(@Req() req: UserRequestInterface, @Param('requestId') requestId: string) {
        return this.accountService.deleteContactRequest(+requestId, req);
    }

    @Delete('contacts/requests/active/:requestId')
    deleteFromContacts(@Req() req: UserRequestInterface, @Param('requestId') requestId: string) {
        return this.accountService.deleteFromContacts(req, +requestId);
    }

}

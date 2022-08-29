import { AccountService } from './account.service';
import { CreateContactRequestDto } from "./dto/create-contact-request.dto";
import { UserRequestInterface } from "../users/types/user-request.interface";
import { ChangeContactRequestDto } from "./dto/change-contact-request.dto";
import { ContactsQueryDto } from "./dto/contacts-query.dto";
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    findContacts(req: UserRequestInterface, contactsQueryDto: ContactsQueryDto): Promise<{
        contacts: import("./entities/contact-request.entity").ContactRequestEntity[];
    }>;
    createContactRequest(req: UserRequestInterface, createContactRequestDto: CreateContactRequestDto): Promise<{
        request: import("./entities/contact-request.entity").ContactRequestEntity;
    }>;
    changeContactRequest(requestId: string, req: UserRequestInterface, changeContactRequestDto: ChangeContactRequestDto): Promise<{
        request: Promise<import("./entities/contact-request.entity").ContactRequestEntity>;
    }>;
    deleteContactRequest(req: UserRequestInterface, requestId: string): Promise<import("../shared/types/message-response.interface").MessageResponseInterface>;
    deleteFromContacts(req: UserRequestInterface, userId: string): string;
}

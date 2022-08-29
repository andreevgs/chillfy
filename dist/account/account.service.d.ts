import { ContactRequestEntity } from "./entities/contact-request.entity";
import { CreateContactRequestDto } from "./dto/create-contact-request.dto";
import { DataSource, Repository } from "typeorm";
import { UserRequestInterface } from "../users/types/user-request.interface";
import { ChangeContactRequestDto } from "./dto/change-contact-request.dto";
import { MessageResponseInterface } from "../shared/types/message-response.interface";
import { ContactsQueryDto } from "./dto/contacts-query.dto";
export declare class AccountService {
    private dataSource;
    private readonly contactRequestRepository;
    constructor(dataSource: DataSource, contactRequestRepository: Repository<ContactRequestEntity>);
    findContacts(req: UserRequestInterface, contactsQueryDto: ContactsQueryDto): Promise<ContactRequestEntity[]>;
    createContactRequest(req: UserRequestInterface, createContactRequestDto: CreateContactRequestDto): Promise<ContactRequestEntity>;
    changeContactRequest(requestId: number, req: UserRequestInterface, changeContactRequestDto: ChangeContactRequestDto): Promise<ContactRequestEntity>;
    deleteContactRequest(requestId: number, req: UserRequestInterface): Promise<MessageResponseInterface>;
    deleteFromContacts(req: UserRequestInterface, userId: number): Promise<MessageResponseInterface>;
    filterContactRequests(req: UserRequestInterface, contactsRequests: ContactRequestEntity[]): ContactRequestEntity[];
}

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UserRequestInterface } from "../users/types/user-request.interface";
import { CreateInvitationDto } from "./dto/create-invitation.dto";
import { UpdateInvitationDto } from "./dto/update-invitation.dto";
import { EmailingService } from "../emailing/emailing.service";
import { AccountService } from "../account/account.service";
export declare class EventsController {
    private readonly eventsService;
    private readonly emailingService;
    private readonly accountService;
    constructor(eventsService: EventsService, emailingService: EmailingService, accountService: AccountService);
    createEvent(req: UserRequestInterface, createEventDto: CreateEventDto): Promise<{
        event: import("./entities/event.entity").EventEntity;
    }>;
    findAllEvents(req: UserRequestInterface): Promise<{
        events: import("./entities/event.entity").EventEntity[];
    }>;
    findInvitations(req: UserRequestInterface): Promise<{
        invitations: import("./entities/invitation.entity").InvitationEntity[];
    }>;
    findEvent(id: string): Promise<{
        event: import("./entities/event.entity").EventEntity;
    }>;
    updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<{
        event: import("./entities/event.entity").EventEntity;
    }>;
    findUninvitedContacts(req: UserRequestInterface, eventId: string): Promise<{
        contacts: import("../account/entities/contact-request.entity").ContactRequestEntity[];
    }>;
    createInvitation(req: UserRequestInterface, createInvitationDto: CreateInvitationDto): Promise<{
        invitation: import("./entities/invitation.entity").InvitationEntity;
    }>;
    findEventInvitations(eventId: string, req: UserRequestInterface): Promise<{
        invitations: import("./entities/invitation.entity").InvitationEntity[];
    }>;
    findEventInvitation(eventId: string, invitationId: string, req: UserRequestInterface): Promise<{
        invitation: import("./entities/invitation.entity").InvitationEntity;
    }>;
    updateEventInvitation(eventId: string, invitationId: string, req: UserRequestInterface, updateInvitationDto: UpdateInvitationDto): Promise<{
        invitation: import("./entities/invitation.entity").InvitationEntity;
    }>;
    deleteEvent(req: UserRequestInterface, eventId: string): Promise<import("../shared/types/message-response.interface").MessageResponseInterface>;
    deleteEventInvitation(eventId: string, invitationId: string, req: UserRequestInterface): Promise<import("../shared/types/message-response.interface").MessageResponseInterface>;
}

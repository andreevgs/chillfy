import { CreateInvitationDto } from "./create-invitation.dto";
export declare class CreateEventDto {
    name: string;
    description?: string;
    date: Date;
    invitations: CreateInvitationDto[];
}

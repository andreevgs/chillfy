import {CreateInvitationDto} from "./create-invitation.dto";
import {IsArray, IsNotEmpty} from "class-validator";

export class CreateInvitationsDto {
    @IsNotEmpty()
    @IsArray()
    invitations: CreateInvitationDto[]
}
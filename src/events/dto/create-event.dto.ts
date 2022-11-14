import {IsArray, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {CreateInvitationDto} from "./create-invitation.dto";

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsArray()
    invitations: CreateInvitationDto[]
}

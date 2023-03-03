import {IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, ValidateNested} from "class-validator";
import {CreateInvitationDto} from "./create-invitation.dto";
import {Type} from "class-transformer";

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
    @ValidateNested({ each: true })
    @Type(() => CreateInvitationDto)
    invitations: CreateInvitationDto[]
}

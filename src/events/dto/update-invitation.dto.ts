import {IsNotEmpty, IsNumber} from "class-validator";

export class UpdateInvitationDto {
    @IsNotEmpty()
    @IsNumber()
    statusId: number;
}
import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateContactRequestDto {
    @IsNotEmpty()
    @IsNumber()
    secondUserId: number;
}
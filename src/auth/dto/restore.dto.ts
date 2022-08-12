import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class RestoreDto {
    @IsNotEmpty()
    @IsNumber()
    confirmationCode: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
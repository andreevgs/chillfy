import {IsNotEmpty, IsNumber} from 'class-validator';
import {LoginUserDto} from "../../users/dto/login-user.dto";

export class ConfirmEmailDto extends LoginUserDto {
    @IsNotEmpty()
    @IsNumber()
    readonly code: number;
}

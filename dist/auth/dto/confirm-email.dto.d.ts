import { LoginUserDto } from "../../users/dto/login-user.dto";
export declare class ConfirmEmailDto extends LoginUserDto {
    readonly code: number;
}

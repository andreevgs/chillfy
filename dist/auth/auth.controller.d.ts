import { AuthService } from './auth.service';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { UsersService } from "../users/users.service";
import { UserRequestInterface } from "../users/types/user-request.interface";
import { ConfirmEmailDto } from "./dto/confirm-email.dto";
import { EmailingService } from "../emailing/emailing.service";
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    private readonly emailingService;
    constructor(authService: AuthService, usersService: UsersService, emailingService: EmailingService);
    createUser(createAuthDto: CreateUserDto): Promise<{
        user: import("../users/entities/user.entity").UserEntity;
    }>;
    login(loginUserDto: LoginUserDto): Promise<import("./types/login-response.interface").LoginResponseInterface>;
    sendConfirmationCode(loginUserDto: LoginUserDto): Promise<import("../shared/types/message-response.interface").MessageResponseInterface>;
    confirmCode(confirmEmailDto: ConfirmEmailDto): Promise<import("../shared/types/message-response.interface").MessageResponseInterface>;
    getNewTokensPair(req: UserRequestInterface): Promise<import("./types/login-response.interface").LoginResponseInterface>;
    logOut(req: UserRequestInterface): Promise<import("../shared/types/message-response.interface").MessageResponseInterface>;
}

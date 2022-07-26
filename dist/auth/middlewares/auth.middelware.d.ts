import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UserRequestInterface } from '../../users/types/user-request.interface';
import { UsersService } from '../../users/users.service';
import { AuthService } from "../auth.service";
export declare class AuthMiddleware implements NestMiddleware {
    private readonly userService;
    private readonly authService;
    constructor(userService: UsersService, authService: AuthService);
    use(req: UserRequestInterface, _: Response, next: NextFunction): Promise<void>;
}

import { Request } from 'express';
import { UserEntity } from "../entities/user.entity";
export interface UserRequestInterface extends Request {
    user?: UserEntity;
    refreshToken?: boolean;
}

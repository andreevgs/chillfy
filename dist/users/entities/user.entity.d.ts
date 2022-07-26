import { RoleEntity } from "./role.entity";
import { RefreshTokenEntity } from "../../auth/entities/refresh-token.entity";
export declare class UserEntity {
    id: number;
    email: string;
    phoneNumber: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmationCode?: number;
    isBlocked?: boolean;
    isConfirmed?: boolean;
    createdAt: Date;
    updatedAt: Date;
    role: RoleEntity;
    refreshToken: RefreshTokenEntity;
    hashPassword(): Promise<void>;
}

import { RoleEntity } from "./role.entity";
import { RefreshTokenEntity } from "../../auth/entities/refresh-token.entity";
import { ContactRequestEntity } from "../../account/entities/contact-request.entity";
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
    contactRequestFirstUser: ContactRequestEntity[];
    contactRequestSecondUser: ContactRequestEntity[];
    hashPassword(): Promise<void>;
}

import { UserEntity } from "../../users/entities/user.entity";
export declare class RefreshTokenEntity {
    id: number;
    token: string;
    expirationDate: Date;
    createdAt: Date;
    updatedAt: Date;
    user: UserEntity;
}

import { UserEntity } from "../../users/entities/user.entity";
export declare class ContactRequestEntity {
    id: number;
    firstUser: UserEntity;
    secondUser: UserEntity;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

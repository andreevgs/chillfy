import { UserEntity } from "./user.entity";
export declare class RoleEntity {
    id: number;
    nameRu: string;
    nameEn: string;
    createdAt: Date;
    users: UserEntity[];
    updatedAt: Date;
}

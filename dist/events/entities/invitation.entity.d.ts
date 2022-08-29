import { UserEntity } from "../../users/entities/user.entity";
import { EventEntity } from "./event.entity";
import { StatusEntity } from "./status.entity";
export declare class InvitationEntity {
    id: number;
    status: StatusEntity;
    user: UserEntity;
    event: EventEntity;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

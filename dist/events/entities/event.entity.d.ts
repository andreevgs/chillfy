import { InvitationEntity } from "./invitation.entity";
import { UserEntity } from "../../users/entities/user.entity";
export declare class EventEntity {
    id: number;
    name: string;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    invitations: InvitationEntity[];
    creator: UserEntity;
    deletedAt: Date;
}

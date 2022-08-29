import { InvitationEntity } from "./invitation.entity";
export declare class StatusEntity {
    id: number;
    nameRu: string;
    nameEn: string;
    invitations: InvitationEntity[];
    createdAt: Date;
    updatedAt: Date;
}

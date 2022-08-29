import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {InvitationEntity} from "./invitation.entity";

@Entity({ name: 'statuses'})
export class StatusEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    nameRu: string;

    @Column()
    nameEn: string;

    @OneToMany(() => InvitationEntity, invitation => invitation.status)
    invitations: InvitationEntity[];

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updatedAt: Date;
}

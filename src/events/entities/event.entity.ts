import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {InvitationEntity} from "./invitation.entity";
import {UserEntity} from "../../users/entities/user.entity";

@Entity({name: 'events'})
export class EventEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    date: Date;

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

    @OneToMany(() => InvitationEntity, invitation => invitation)
    invitations: InvitationEntity[];

    @ManyToOne(() => UserEntity, user => user)
    creator: UserEntity;

    @DeleteDateColumn()
    public deletedAt: Date;
}

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {EventEntity} from "./event.entity";
import {StatusEntity} from "./status.entity";

@Entity({name: 'invitations'})
export class InvitationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StatusEntity, status => status.invitations)
    status: StatusEntity;

    @ManyToOne(() => UserEntity, user => user.invitations)
    user: UserEntity;

    @ManyToOne(() => EventEntity, event => event.invitations)
    event: EventEntity;

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

    @DeleteDateColumn()
    public deletedAt: Date;
}